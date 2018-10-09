#!/usr/bin/python3
import argparse
import csv
import glob
import json
import re
from langid import classify
from pathlib import Path
from multiprocessing import cpu_count
from multiprocessing import Process
from nlp.datacleaning import cleanData


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

    def csvReader(self, fname, delimiter, quotechar):
        with open(str(fname), "r", newline='\n') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=delimiter, quotechar=quotechar)
            for row in csv_reader:
                yield row    
        

    def nodeExtractor(self,data,nodes,key):
        keys = nodes[key]['keys']
        id_nodes = ['editionISBN','person','place','publisher']
        for line in data:
            extracted = []
            for value in keys:
                try:
                    
                    #Clean data for deduping 

                    # If items are in a list
                    if (isinstance(line[value], list)):
                        for i in range(len(line[value])):
                            line[value][i] = cleanData(line[value][i])
                            
                        line[value] = '›'.join(line[value])

                    else:
                        line[value] = cleanData(line[value])

                    #If value is one we associate with an ID number
                    if value in id_nodes:
                        #Check if we've seen value before so we don't end up with duplicate values that have different IDs
                        if line[value] in self.used_IDs:
                            extracted.append(self.used_IDs[line[value]])
                            self.current_ID += 1
                        else:
                            extracted.append(self.current_ID)
                            self.used_IDs[line[value]] = self.current_ID
                            self.current_ID += 1

                    #Some basic regex to strip out non-year values in editionDate field
                    if value == "editionDate":
                        try:
                            years = re.findall(r'[0-9]{4}', line[value])
                            years = "›".join(years)
                            line[value] = years 
                        except:
                                line[value] = "Unknown"

                    extracted.append(line[value])

                except KeyError:
                    if value in id_nodes:
                        extracted.append(self.current_ID)
                        self.current_ID += 1
                    extracted.append("unknown")
            extracted.append(key)
            yield extracted
             
    def relExtractor(self,keys,label,nodes, delimiter, quotechar):
        node1 = self.csvReader(fname=nodes[keys[0]]['fname'],
                                delimiter=delimiter,
                                quotechar=quotechar)
        
        node2 = self.csvReader(fname=nodes[keys[1]]['fname'],
                                delimiter=delimiter,
                                quotechar=quotechar)

        for n1,n2 in zip(node1,node2):
            yield [n1[0],n2[0],label] 



def extractNode(key):
    extractor = LocExtractor()
    if args.all:
        batches = ["batch{}.json".format(x) for x in range(0,118)]
    elif args.s and args.f:
        batches = ["batch{}.json".format(x) for x in range(int(args.s),int(args.f)+1)]
    
    # Load each batch individually. Takes a lot less ram. 
    for batch in batches:
        batch = Path(args.b) / batch
        with open(str(batch),'r') as f:
            data = json.load(f)
            extractor.csvWriter(extractor.nodeExtractor(data=data,nodes=nodes,key=key),fname=nodes[key]['fname'],delimiter=args.d,quotechar=args.q)  


def extractRel(key):
    extractor = LocExtractor()
    extractor.csvWriter(extractor.relExtractor(keys=relations[key]['nodes'],
               label=relations[key]['label'],nodes=nodes,delimiter=args.d,quotechar=args.q),
               fname=relations[key]['fname'],delimiter=args.d,quotechar=args.q)

#Some basic language detection
def extractLang():
    extractor = LocExtractor()
    lang_support = save_dir / "supported_languages.csv"
    lang_name = save_dir / "language_rel_batch.csv"
    for lines in extractor.csvReader(fname=nodes["Edition"]['fname'], delimiter=args.d,quotechar=args.q):
        editionTitle = lines[2]
        language = classify(editionTitle)
        if (language[1] > -10.0):
            language = "Unknown"
        else:
            language = language[0]
        
        yield [language, lines[0], "LANGUAGE"] 
        

if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog='locextract.py', description="Converts LOC dataset into CSV that is parsable by Neo4j", usage="./locextract -b /batch/file/path -e /extracted/file/path -q quotechar -d delimiter -s startbatch -f endbatch")
    parser.add_argument("--all", help='Process all batches in current directory')
    parser.add_argument("-e",default='/neo4j/data/loc/extracted/data/',help='Specify extraction path')
    parser.add_argument("-b", default='/neo4j/data/loc', help="Specify batch location")
    parser.add_argument("-q",default='"', help='Specify quotation character')
    parser.add_argument("-d", default="|", help='Specifiy delimiter')
    parser.add_argument("-s", default=0, help='Specify start batch')
    parser.add_argument("-f", default=0, help='Specify finish batch')
    args = parser.parse_args()

    save_dir = Path(args.e)

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
    processes = [Process(target=extractNode, args=(key,)) for key in nodes.keys()]
    for p in processes:
        p.start()
    for p in processes:
        p.join() 

    #Could probably get away with staggering instead of joining processes above
    #but best to avoid race conditions
    processes = [Process(target=extractRel, args=(key,)) for key in relations.keys()]
    for p in processes:
        p.start()
    for p in processes:
        p.join()

    def extractLangs():
        #TODO Clean this up
        extractor = LocExtractor()
        languages = extractLang()
        lang_name = save_dir / "language_rel_batch.csv"
        extractor.csvWriter(fname=lang_name,data=languages,delimiter=args.d,quotechar=args.q)
    
    #extractLangs()
