import argparse
import csv
import itertools
import json
import multiprocessing as mp
import msgpack
import string

from collections import defaultdict

def jsontocsv(data):
    records = []
    headers = ['id', 'tag']
    codes = list(string.ascii_lowercase)
    headers.extend(list(range(10)))
    headers.extend(codes)
    headers = [str(x) for x in headers]
    indices = {k:v for k,v in zip(headers,range(len(headers)))}
    for row in data:
        if row == None:
            continue
        row = json.loads(row)
        cid = row['id'] 
        for key,value in row.items():
            if key != 'id':
                for subrow in value:
                    if isinstance(subrow, dict):
                        curr_row = [None]*len(headers)
                        curr_row[indices['id']] = cid
                        curr_row[indices['tag']] = key
                        curr_row[indices[subrow['@code']]] = subrow['#text']
                        records.append(curr_row)
                    elif isinstance(subrow[0], dict):
                        curr_row = [None]*len(headers)
                        curr_row[indices['id']] = cid
                        curr_row[indices['tag']] = key
                        for x in subrow:
                            curr_row[indices[x['@code']]] = x['#text']
                        records.append(curr_row)
                    elif isinstance(subrow[0], list):
                        for subrow2 in subrow:
                            curr_row = [None]*len(headers)
                            curr_row[indices['id']] = cid
                            curr_row[indices['tag']] = key
                            for x in subrow2:
                                curr_row[indices[x['@code']]] = x['#text']
                            records.append(curr_row)


    # print(records)
    records = msgpack.packb(records, use_bin_type=True)
    queue.put(records)
def writeRecords(queue, outfile):
    headers = ['id', 'tag']
    codes = list(string.ascii_lowercase)
    headers.extend(list(range(10)))
    headers.extend(codes)
    headers = [str(x) for x in headers]
    noterm = True 
    counter = 0
    with open(outfile, "a") as write_handle:
        csv_writer = csv.writer(write_handle, delimiter='\t')
        while queue.qsize() > 1 or noterm:
            data = queue.get()
            if data == None:
                noterm = False
                continue
            data = msgpack.unpackb(data, use_list=False, raw=False)
            if counter == 0:
                csv_writer.writerow(headers)
                csv_writer.writerows(data)
                counter += 1
            else:
                csv_writer.writerows(data)
    

def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return itertools.zip_longest(*args, fillvalue=fillvalue)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Converts JSON to CSV")
    parser.add_argument("-i","--infile",help="Input JSON file")
    parser.add_argument("-o","--outfile",help="Output CSV file")
    arguments = parser.parse_args()

    queue = mp.Queue()
    outfile = arguments.outfile
    p1 = mp.Process(target=writeRecords, args=[queue, outfile])
    p1.start()
    try:
        pool = mp.Pool(15, initargs=(queue))
        with open(arguments.infile) as read_handle:
            iterator = grouper(read_handle, 100)
            for res in pool.imap(jsontocsv, iterator):
                pass
        queue.put(None)

        p1.join()

    except:
        raise
        print("Unable to open files")
