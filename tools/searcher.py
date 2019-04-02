import csv
import json
from itertools import groupby
from operator import itemgetter
from multiprocessing import Pool
from collections import defaultdict
from simstring.feature_extractor.character_ngram import CharacterNgramFeatureExtractor
from simstring.measure.cosine import CosineMeasure
from simstring.database.dict import DictDatabase
from simstring.searcher import Searcher
import pickle


def loadBatch(name):

    try:
        with open('binary/{}.pickle'.format(name),'rb') as handle:
            data = pickle.load(handle)
        with open('binary/{}_id_mapping.pickle'.format(name),'rb') as handle:
            id_mapping = pickle.load(handle)
        return data,id_mapping

    except:
        raise
        data = DictDatabase(CharacterNgramFeatureExtractor(2))
        id_mapping = {}
        #/work/hcnorris/json/data/place_batch.csv
        with open('/home/n4user/json/cleaned_data/{}_batch.csv'.format(name)) as BatchData:
            csvReader = csv.reader(BatchData,delimiter='\t')
            for row in csvReader:
                if row[1] != "":
                    id_mapping[row[1]] = row[0]
                    data.add(row[1])

        with open('binary/{}.pickle'.format(name),'wb') as handle:
            pickle.dump(data, handle, protocol=pickle.HIGHEST_PROTOCOL)
        with open('binary/{}_id_mapping.pickle'.format(name),'wb') as handle:
            pickle.dump(id_mapping, handle, protocol=pickle.HIGHEST_PROTOCOL)

        return data,id_mapping

def cosSearch(data,id_mapping,search_phrase,threshold):
    searcher = Searcher(data, CosineMeasure())
    results = searcher.search(search_phrase, threshold)
    return_list = []
    for res in results:
        return_list.append([res,int(id_mapping[res])])
    return return_list

data,id_mapping = loadBatch('person')
searchName = lambda name,threshold: cosSearch(data=data,id_mapping=id_mapping,search_phrase=name,threshold=threshold)


