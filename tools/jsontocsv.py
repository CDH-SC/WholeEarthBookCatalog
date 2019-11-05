import argparse
import csv
import itertools
import json
import multiprocessing as mp
import msgpack
import string

from collections import defaultdict

def jsontocsv(data):
    # Precompute all tables for writing
    records = table
    for row in data:
        if row == None:
            continue
        row = json.loads(row)
        cid = row['id'] 
        for key,value in row.items():
            if key != 'id':
                for subrow in value:
                    if isinstance(subrow, dict):
                        curr_row = table[table_ind[key]["t_v"]][1]
                        curr_row[0] = cid
                        curr_row[table_ind[key][subrow['@code']]] = subrow['#text']
                        records[table_ind[key]["t_v"]].append(tuple(curr_row))
                    elif isinstance(subrow[0], dict):
                        curr_row = table[table_ind[key]["t_v"]][1]
                        curr_row[0] = cid
                        for x in subrow:
                            curr_row[table_ind[key][x['@code']]] = x['#text']
                        records[table_ind[key]["t_v"]].append(tuple(curr_row))


    records = msgpack.packb(records, use_bin_type=True)
    queue.put(records)

def writeRecords(queue, split_dir, table_ind):
    tables = list(sorted(table_ind.keys(), key=lambda x: int(x)))
    write_handles = [csv.writer(open("{}/{}.tsv".format(split_dir, t), "w"), delimiter='\t') for t in tables]
    noterm = True
    counter = 0
    while queue.qsize() > 1 or noterm:
        data = queue.get()
        if data == None:
            noterm = False
            continue
        data = msgpack.unpackb(data, use_list=False, raw=False)
        if counter == 0:
            for col,handle in zip(data, write_handles):
                handle.writerows(col)
            counter += 1
        else:
            for col,handle in zip(data, write_handles):
                handle.writerows(col[1:])
    

def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return itertools.zip_longest(*args, fillvalue=fillvalue)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Converts JSON to CSV")
    parser.add_argument("-i", "--infile", help="Input JSON file", required=True)
    parser.add_argument('-s', "--split_dir", help="Split Directory", required=True)
    arguments = parser.parse_args()

    queue = mp.Queue()

    split_dir = arguments.split_dir
    perms = json.load(open("perms.json"))
    table = [[[None]*(len(v)+1)] for k,v in sorted(perms.items(), key=lambda x: int(x[0]))]
    table_ind = {}

    counter = 0
    for key,value in sorted(perms.items(), key=lambda x: int(x[0])):
        table_ind[key] = {k:v for k,v in zip(sorted(value), range(1, len(value)+1))}
        table_ind[key]["t_v"] = counter
        table[counter] = [tuple(["id"] + [k for k in sorted(value)])] + table[counter]
        table_ind[key]["id"] = 0
        counter += 1

    p1 = mp.Process(target=writeRecords, args=[queue, split_dir, table_ind])
    p1.start()

    try:
        pool = mp.Pool(15, initargs=(queue, table, table_ind))
        with open(arguments.infile) as read_handle:
            iterator = grouper(read_handle, 100)
            for res in pool.imap(jsontocsv, iterator):
                pass
        queue.put(None)

        p1.join()

    except:
        raise
        print("Unable to open files")
