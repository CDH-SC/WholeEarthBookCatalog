import argparse
import copy
import csv
import itertools
import json
import multiprocessing as mp
import msgpack
import string

from collections import defaultdict

# Precompute all tables for writing
# Ugly code because I was trying to be clever. I apologize
def jsontocsv(data):

    records = copy.deepcopy(table)
    for row in data:
        if row == None:
            continue
        row = json.loads(row)
        cid = row['id'] 
        # cid is the cluster id
        for key,value in row.items():
            # Keys are the tags, (e.g. 100, 700, etc.)
            # Values are the codes
            if key != 'id':
                for subrow in value:
                    # Check if subrow is just a dict
                    if isinstance(subrow, dict):

                        # Very important to copy, otherwise you just get a reference to table
                        # Contains a list of Nones that are updated to their corresponding code values
                        # If code doesn't exist in tag, field left blank
                        curr_row = copy.deepcopy(table[table_ind[key]["t_v"]][1])

                        # Set the cluster id
                        curr_row[0] = cid

                        # table_ind[key][subrow['@code']] contains the column index where this value belongs
                        curr_row[table_ind[key][subrow['@code']]] = subrow['#text']

                        # table_ind[key]["t_v"] contains the records row where this value goes
                        records[table_ind[key]["t_v"]].append(tuple(curr_row))

                    # Check if subrow is list of dicts
                    # If so, iterate over
                    elif isinstance(subrow[0], dict):
                        curr_row = copy.deepcopy(table[table_ind[key]["t_v"]][1])
                        curr_row[0] = cid
                        for x in subrow:
                            curr_row[table_ind[key][x['@code']]] = x['#text']
                        records[table_ind[key]["t_v"]].append(tuple(curr_row))

    # msgpack the data for faster queueing
    records = msgpack.packb(records, use_bin_type=True)

    # Send data to queue process to be written to file
    queue.put(records)

def writeRecords(queue, split_dir, table_ind):

    # Open file handle for every possible tag 
    # Terrible but consise way to do this
    tables = list(sorted(table_ind.keys(), key=lambda x: int(x)))
    write_handles = [csv.writer(open("{}/{}.tsv".format(split_dir, t), "w"), delimiter='\t') for t in tables]

    noterm = True
    counter = 0

    # If queue larger than 1 or if flag for completed processes not set
    while queue.qsize() > 1 or noterm:
        data = queue.get()
        if data == None:
            noterm = False
            continue

        # Unpack the msgpacked lists
        data = msgpack.unpackb(data, use_list=False, raw=False)

        # if counter is 0, then write header
        if counter == 0:
            for col,handle in zip(data, write_handles):
                handle.writerow(col[0])

                # col[1] is just nones
                # TODO fix this
                handle.writerows(col[2:])

            counter += 1
        else:
            for col,handle in zip(data, write_handles):
                if len(col) > 2:

                    # col[1] is just nones
                    # TODO fix this
                    handle.writerows(col[2:])
    


# Grouper function that turns json file into iterable  of chunksize n
def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return itertools.zip_longest(*args, fillvalue=fillvalue)

if __name__ == "__main__":


    # Argparse arguments
    parser = argparse.ArgumentParser(description="Converts JSON to CSV")
    parser.add_argument("-i", "--infile", help="Input JSON file", required=True)
    parser.add_argument('-s', "--split_dir", help="Split Directory", required=True)
    arguments = parser.parse_args()

    queue = mp.Queue()


    # Load all possible permutations of tags and codes
    split_dir = arguments.split_dir
    perms = json.load(open("perms.json"))
    table = [[[None]*(len(v)+1)] for k,v in sorted(perms.items(), key=lambda x: int(x[0]))]
    table_ind = {}


    # Initialize table
    counter = 0
    for key,value in sorted(perms.items(), key=lambda x: int(x[0])):
        table_ind[key] = {k:v for k,v in zip(sorted(value), range(1, len(value)+1))}
        table_ind[key]["t_v"] = counter
        table[counter] = [tuple(["id"] + [k for k in sorted(value)])] + table[counter]
        table_ind[key]["id"] = 0
        counter += 1

    p1 = mp.Process(target=writeRecords, args=[queue, split_dir, table_ind])
    p1.start()


    # Launch process pool of 15 processes, iterating over JSON data until completion
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
