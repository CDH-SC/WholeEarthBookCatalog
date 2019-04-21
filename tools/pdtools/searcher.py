import cPickle as pickle
import json
from itertools import groupby
from operator import itemgetter
from multiprocessing import Pool
from collections import defaultdict
from simstring.feature_extractor.character_ngram import CharacterNgramFeatureExtractor
from simstring.measure.cosine import CosineMeasure
from simstring.database.dict import DictDatabase
from simstring.searcher import Searcher


def loadBatch(name):

    try:
        id_mapping_dir = "{}/data/binary/{}/{}_id_mapping.pickle".format(os.environ['WEBC_DIR'],os.environ['DATA_VER'],name)
        with open(id_mapping_dir, 'rb') as handle:
            id_mapping = pickle.load(handle)
        id_data_dir = "{}/data/binary/{}/{}_data.pickle".format(os.environ['WEBC_DIR'],os.environ['DATA_VER'],name)
        with open(id_data_dir, 'rb') as handle:
            id_mapping = pickle.load(handle)
            data = pickle.load(handle)
        return data,id_mapping

    except:
        from load_all import *
        dframe = big_df
        data = DictDatabase(CharacterNgramFeatureExtractor(2))
        id_mapping = {}
        agg_dict = {}
        for row in dframe[['{}_ID'.format(name),'{}_Name'.format(name)]].fillna('').values.tolist():
            if row[1] != "":
                id_mapping[row[1]] = row[0]
                data.add(row[1])
        
        id_mapping_dir = "{}/data/binary/{}/{}_id_mapping.pickle".format(os.environ['WEBC_DIR'],os.environ['DATA_VER'],name)
        id_data_dir = "{}/data/binary/{}/{}_data.pickle".format(os.environ['WEBC_DIR'],os.environ['DATA_VER'],name)
        with open(id_mapping_dir, 'wb') as handle:
            pickle.dump(id_mapping, handle, protocol=pickle.HIGHEST_PROTOCOL)
        with open(id_data_dir, 'wb') as handle:
            pickle.dump(data, handle, protocol=pickle.HIGHEST_PROTOCOL)

        return data,id_mapping

def cosSearch(data,id_mapping,search_phrase,threshold):
    searcher = Searcher(data, CosineMeasure())
    results = searcher.search(search_phrase, threshold)
    return_list = []
    for res in results:
        return_list.append([res,int(id_mapping[res])])
    return return_list


if __name__ == '__main__':
    data,id_mapping = loadBatch('Place')
    searchName = lambda name,threshold: cosSearch(data=data,id_mapping=id_mapping,search_phrase=name,threshold=threshold)


