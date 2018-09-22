#!/usr/bin/python3
import argparse
import csv
import glob
import json
from pathlib import Path

def csvWriter(data, fname, delimeter, quotechar):
    
    with open(fname, "a", newline='') as csv_file:
        csv_writer = csv.writer(csv_file, delimiter=delimter, 
                                #csv.QUOTE_MINIMAL specifies to only include quote character where special characters exist 
                                quotechar=quotechar,quoting=csv.QUOTE_MINIMAL)
        for line in data:
            csv_writer.writerow(line)

def csvReader(fname, delimiter, quotechar):
    
    with open(fname, 'r', newline='') as csv_file:
        csv_reader = csv,reader(csvfile, delimter=delimiter, quotechar=quotechar)
        
#TODO handle deduplication of data and nodeID's 
def nodeExtractor(data,key,nodeID):
    keys = nodes[key]['keys']
    extracted = []
    for line in data:
        for value in keys:
            try:
                extracted.append(data[value])
            except:
                #In the case of empty fields
                extracted.append("unknown")
            yield extracted
         
#TODO relationship extractor
def relExtractor(data,nodes,label):
    return     
    

def main():
    parser = argparse.ArgumentParser(prog='locextract.py', description="Converts LOC dataset into CSV that is parsable by Neo4j", usage="./locextract -p /some/file/path -q quotechar -d delimter -s startbatch -f endbatch")
    parser.add_argument("--all", help='Process all batches in current directory')
    parser.add_argument("-p",default='extracted/data/',help='Specify File Path')
    parser.add_argument("-q",default='"', help='Specify quotation character')
    parser.add_argument("-d", default="|", help='Specifiy delimter')
    parser.add_argument("-s", default=0, help='Specify start batch')
    parser.add_argument("-f", default=0, help='Specify finish batch')
    args = parser.parse_args()

    if args.help:
        print ("Enter the ranger of batch files you would like to convert \nto CSV, or --all for all the batch files in this directory. \nSpecify the save directory with -p, otherwise default will be used.\nSpecify delimter character with -d.\nSpecify the quote character with -q\nSpecify the start batch with -s and the last batch with -f") 
        return 

    save_dir = Path(args.p)

    #Define all possible node types. fname is the final save directory of the extracted batch
    # ID necessary for sorting nodes that are missing key values
    nodes = { 'Place': {
                        'fname': save_dir / "place_batch.csv", 
                        'keys': ["place"],
                        'ID': 0
                        },
            'Edition': {
                        'fname': save_dir/ "edition_batch.csv", 
                        'keys': ["editionISBN","editionTitle","editionDate"],
                        'ID': 0
                        },
            'Publisher': {
                        'fname':save_dir / "publisher_batch.csv", 
                        'keys': ["publisher"],
                        'ID': 0
                        },
            'Person': {
                        'fname': save_dir / "person_batch.csv", 
                        'keys': ["person"],
                        'ID': 0
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

    if args.all:
        batches = glob.glob("./batch*.json")
    elif args.s and args.f:
        batches = ["batch{}".format(x) for x in range(args.s,args.f+1)]
    
    # Load each batch individually. Takes a lot less ram. 
    for batch in batches:
        with open(batch,'r') as f:
            data = json.load(f)
        for key in nodes.keys():
           csv_wrter(nodeExtractor(data=data,key=key,
                     nodeID=nodes[key]['ID']),
                     fname=nodes[key]['fname'],delimter=args.d)  

        for key in relations.keys():
            csv_writer(relExtractor(data=data,nodes=relations[key]['nodes'],
                       label=relations[key]['label']),
                       fname=relations[key]['fname'],delimter=args.d)
    
                 

if __name__ == "__main__":
   main() 
