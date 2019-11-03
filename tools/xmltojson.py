import argparse
import itertools
import json
import multiprocessing as mp
import xmltodict

from collections import defaultdict

def xmltojson(data):
    records = []
    for row in data:
        try:
            if row == None:
                continue
            cdict = defaultdict(list)
            curr = xmltodict.parse(row)['record']
            cdict['id'] = int(curr['controlfield'][0]['#text'])
            for subfield in curr['datafield']:
                tag = int(subfield['@tag'])
                if tag != 40:
                    sub_data = subfield['subfield']
                    cdict[tag].append(sub_data)
            records.append(cdict)
        except:
            print(row)

    return [json.dumps(x) for x in records]

def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return itertools.zip_longest(*args, fillvalue=fillvalue)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Converts XML To JSON")
    parser.add_argument("-i","--infile",help="Input XML file")
    parser.add_argument("-o","--outfile",help="Output JSON file")
    arguments = parser.parse_args()

    try:
        pool = mp.Pool()
        with open(arguments.infile) as read_handle:
            with open(arguments.outfile, "w+") as write_handle:
                iterator = grouper(read_handle, 500)
                for res in pool.imap(xmltojson, iterator):
                    for item in res:
                        write_handle.write(item + "\n")


    except:
        raise
        print("Unable to open files")
