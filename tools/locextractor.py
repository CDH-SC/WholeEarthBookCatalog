#!/usr/bin/python3
import argparse
import csv
import glob
import json
from pathlib import Path
from multiprocessing import Process


class LocExtractor():
    def __init__(self):
        self.used_IDs = {}
        self.current_ID = 0

    def csvWriter(self,data, fname, delimiter, quotechar):
        
        with open(str(fname), "a", newline='\n') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter=delimiter, 
                                    #csv.QUOTE_MINIMAL specifies to only include quote character where special characters exist 
                                    quotechar=quotechar,quoting=csv.QUOTE_MINIMAL)
            for line in data:
                csv_writer.writerow(line)

    def nodeExtractor(self,data,nodes,key):
        keys = nodes[key]['keys']
        id_nodes = ['editionISBN','person','place','publisher']
        for line in data:
            extracted = []
            for value in keys:
                try:
                    #If value is one we associate with an ID number
                    if value in id_nodes:
                        #Check if item is a list. TODO Add list support
                        if (isinstance(line[value], list)):
                            line[value] = ' '.join(line[value])
                        #Check if we've seen value before so we don't end up with duplicate values that have different IDs
                        if line[value] in self.used_IDs:
                            extracted.append(self.used_IDs[line[value]])
                            self.current_ID += 1
                        else:
                            extracted.append(self.current_ID)
                            self.used_IDs[line[value]] = self.current_ID
                            self.current_ID += 1

                    extracted.append(line[value])

                except KeyError:
                    if value in id_nodes:
                        extracted.append(self.current_ID)
                        self.current_ID += 1
                    extracted.append("unknown")
            yield extracted
             
    #TODO relationship extractor
    def relExtractor(self,data,nodes,label):
        return 
    
    


def main(key):
    extractor = LocExtractor()
    if args.all:
        batches = ["batch{}.json".format(x) for x in range(0,118)]
    elif args.s and args.f:
        batches = ["batch{}.json".format(x) for x in range(int(args.s),int(args.f)+1)]
    
    # Load each batch individually. Takes a lot less ram. 
    for batch in batches:
        with open(batch,'r') as f:
            data = json.load(f)
            extractor.csvWriter(extractor.nodeExtractor(data=data,nodes=nodes,key=key),fname=nodes[key]['fname'],delimiter=args.d,quotechar=args.q)  


#    for key in relations.keys():
#        csv_writer(relExtractor(nodes=relations[key]['nodes'],
#                   label=relations[key]['label']),
#                   fname=relations[key]['fname'],delimiter=args.d,quotes=args.q)
#
                 

if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog='locextract.py', description="Converts LOC dataset into CSV that is parsable by Neo4j", usage="./locextract -p /some/file/path -q quotechar -d delimiter -s startbatch -f endbatch")
    parser.add_argument("--all", help='Process all batches in current directory')
    parser.add_argument("-p",default='/neo4j/data/loc/extracted/data/',help='Specify File Path')
    parser.add_argument("-q",default='"', help='Specify quotation character')
    parser.add_argument("-d", default="|", help='Specifiy delimiter')
    parser.add_argument("-s", default=0, help='Specify start batch')
    parser.add_argument("-f", default=0, help='Specify finish batch')
    args = parser.parse_args()

    save_dir = Path(args.p)

    #Define all possible node types. fname is the final save directory of the extracted batch
    nodes = { 'Place': {
                        'fname': save_dir / "place_batch.csv", 
                        'keys': ["place"],
                        },
            'Edition': {
                        'fname': save_dir/ "edition_batch.csv", 
                        'keys': ["editionISBN","editionTitle","editionDate"],
                        },
            'Publisher': {
                        'fname':save_dir / "publisher_batch.csv", 
                        'keys': ["publisher"],
                        },
            'Person': {
                        'fname': save_dir / "person_batch.csv", 
                        'keys': ["person"],
                        },
            }

    #Define all possible relation types. fname is the final save directory of the extracted batch
    relations = {
            'PlaceR' : {
                        'fname': save_dir / "place_rel_batch.csv", 
                        'nodes': ["Edition","Place"],
                        'label': "PUBLISHED_IN"
                        },
            'WroteR': {
                        'fname': save_dir / "wrote_rel_batch.csv", 
                        'nodes': ["Person","Edition"],
                        'label': "WROTE"
                        },
            'PublishedR': {
                            'fname': save_dir / "published_rel_batch.csv",
                            'nodes': ["Publisher","Edition"],
                            'label': "PUBLISHED"
                        }
            }  

    #Spawn a new process for every key for an easy 4X performance boost
    processes = [Process(target=main, args=(key,)) for key in nodes.keys()]
    for p in processes:
        p.start()
        
