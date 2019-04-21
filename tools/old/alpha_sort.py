# Too slow :(
import csv
import json
from fuzzywuzzy import fuzz
from itertools import groupby
from operator import itemgetter
from multiprocessing import Pool
from collections import defaultdict
import sys
import pprint
import pickle
import codecs

def getMatchCount(match_data):
    count = 0
    matches = defaultdict(list)
    matched_titles = []
    for item1 in match_data:	
        if item1 not in matched_titles:
                matched_titles.append(item1)
                for item2 in match_data:
                                if item2 not in matched_titles:
                                        ratio = fuzz.ratio(item1[1].lower(),item2[1].lower())
                                        if ratio > 95 and ratio != 100:
                                                count += 1
                                                matches[item1].append(item2)
                                                matched_titles.append(item2) 
    
    #data = json.dumps(matches, ensure_ascii=False)
    #loaded_data = json.loads(data)
    #print(json.dumps(matches, indent=4, ensure_ascii=False))
#    with open('dupes.pickle','wb+') as handle:
#        pickle.dump(matches, handle, protocol=pickle.HIGHEST_PROTOCOL)
    return matches

def loadBatch(name):
    data = set()
    #/work/hcnorris/json/data/place_batch.csv
    with open('/home/n4user/json/data/{}_batch.csv'.format(name)) as placeData:
        csvReader = csv.reader(placeData)
        for row in placeData:
            items = row.split("\t")
            if items[1] != "":
                data.add((items[0],items[1],items[1][0]))

    data = sorted(list(data), key=lambda x: x[1])
    grouped_items = [list(g) for k, g in groupby(data, itemgetter(2))]
    return sorted(grouped_items, key = len)

#for item1 in grouped_places[0]:
#    for item2 in grouped_places[35]:
#        ratio = fuzz.ratio(item1,item2)
#        if ratio > 90 and ratio != 100:
#            print ("Possible match: {} AND {}".format(item1,item2))

p = Pool(10)
print("---PLACES---")
matches = defaultdict(list)
batch = loadBatch('place')
for i in p.map(getMatchCount, batch[30:35]):
    for k, v in i.items():
        matches[k].append(v)
print("---EDITIONS---")
batch = loadBatch('edition')
for i in p.map(getMatchCount, batch[30:35]):
    for k, v in i.items():
        matches[k].append(v)
print("---PEOPLE---")
batch = loadBatch('person')
for i in p.map(getMatchCount, batch[30:35]):
    for k, v in i.items():
        matches[k].append(v)
print("---PUBLISHERS---")
batch = loadBatch('publisher')
for i in p.map(getMatchCount, batch[30:35]):
    for k, v in i.items():
        matches[k].append(v)

with open('dupes.pickle','wb+') as handle:
    pickle.dump(matches, handle, protocol=pickle.HIGHEST_PROTOCOL)



