import argparse
import json
import lxml
import os
import pandas as pd
import pyarrow as pa
import msgpack
import multiprocessing as mp
import shutil

from itertools import zip_longest
from lxml import etree

def loadSchema(schema_file):
    try:
        with open(schema_file, "r") as rhandle:
            schema = json.load(rhandle)
        return schema 

    except:
        raise


def parseMarc(marc_data):
    marc_data = msgpack.unpackb(marc_data, use_list=False, raw=False)
    tsv_data = []
    header = []
    ns = {"ns": "http://www.loc.gov/MARC21/slim" }

    for datafield, subfields in schema["schema"].items():
        for subfield in subfields:
            header.append(subfield["name"])

    for row in marc_data:

        try:
            row = etree.fromstring(row)
        except:
            continue 

        row = etree.ElementTree(row)
        current_row = []
        for datafield, subfields in schema["schema"].items():
            search_string = ".//ns:datafield[@tag=\"{}\"]".format(datafield)
            for subfield in subfields:
                data = row.xpath(".//ns:datafield[@tag=\"{}\"]/ns:subfield[@code=\"{}\"]/text()".format(datafield, subfield["code"]), namespaces=ns)

                if subfield['name'] == "ViafID" and data:
                    data = data.split("/")[-1]

                if data:

                    if len(data) == 1:
                        current_row.append(data[0])

                    else:
                        current_row.append(data)

                else:
                    current_row.append("")

        tsv_data.append(current_row)

    df = pd.DataFrame(tsv_data, columns=header)
    df = pa.Table.from_pandas(df)
    q.put(df)


def remoteQueue(q):
    return

    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5557")
    while q.size() > 0 or stop == False:

        rows = q.get() 

        if rows == None:
            stop = True

        else:
            rows = rows.to_pandas() 


def localQueue(q, split_dir, schema):

    file_list = schema["file_list"]
    stop = False 

    if not os.path.isdir(split_dir):
        os.mkdir(split_dir)

    else:
        shutil.rmtree(split_dir)
        os.mkdir(split_dir)

    f_count = 0
    while q.qsize() > 0 or stop == False:

        rows = q.get() 

        if rows == None:
            stop = True
            continue

        else:
            rows = rows.to_pandas()

    
        
        for key in file_list.keys():

            if f_count == 0:
                rows[file_list[key]["definition"]].to_csv(os.path.join(split_dir, file_list[key]["fname"]), header="column_names", index=False)

            else:
                rows[file_list[key]["definition"]].to_csv(os.path.join(split_dir, file_list[key]["fname"]), mode="a", header=False, index=False)

        f_count += 1


# StackOverFlow fucntion for pulling data from an iterable in chunk sizes of n
def grouper(iterable, n, fillvalue=None):
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=fillvalue)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process Marc21 Data')
    parser.add_argument('--infile', '-i', help='Infile (XML) name', required=True)
    parser.add_argument('--outfile', '-o', help='Outfile (TSV) name', required=True)
    parser.add_argument('--split', '-s', help='Split TSV File into Nodes in this directory', required=True)
    parser.add_argument("--cpus", "-c", help="CPU Core Count Override")
    parser.add_argument("--step", "-z", help="Chunk size for data")
    parser.add_argument("--schema", "-d", help="Schema File", required=True)
    args = parser.parse_args()
    infile = args.infile
    outfile = args.outfile
    schema = loadSchema(args.schema)
    split_dir = args.split

    with open(infile, "r") as read_handle:
        global q

        # How many records to send to each map function
        # 10 - 100 seems to be the optimal size
        if args.step:
            step_size = int(args.step)
        else:
            step_size = 1000

        # Iterator that reads from the XML file in chunks of size step_size
        iterator = grouper(read_handle, step_size)

        # Instantiate a multiprocessing queue for each core to feed their results to
        q = mp.Queue()

        t = mp.Process(target=localQueue, args=[q, split_dir, schema])
        t.daemon = True
        t.start()

        # Map all the data to the xmlToTsv function
        if args.cpus:
            cpus = int(args.cpus)
        else:
            cpus = os.cpu_count() - 1

        
        pool = mp.Pool(cpus, initargs=(q, schema))

        def msgPackMe(data):
            return msgpack.packb(data, use_bin_type=True)

        for res in pool.imap_unordered(parseMarc, map(msgPackMe, iterator)):
            pass

        q.put(None)
        t.join()



