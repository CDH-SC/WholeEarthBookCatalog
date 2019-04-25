#!/usr/bin/python3
from multiprocessing import Pool,Process,Pipe,Manager
from collections import deque
import pandas as pd
import numpy as np
import json
import os
from time import time
#from distance_test import *
from nlp.datacleaning import *
import string

webc_dir = os.environ['WEBC_DIR']
data_ver =os.environ['DATA_VER']

# Make a class to utilize copy-on-write mechanism when using Pool.map
'''
class data_dicts:
    def __init__(self,place_dict=None,person_dict=None,ISBN_dict=None,publisher_dict=None):
        self.place_dict = place_dict
        self.person_dict = person_dict
        self.ISBN_dict = ISBN_dict
        self.publisher_dict = publisher_dict
'''

def loadData(n):
    with open("{}/data//json/{}/batch{}.json".format(webc_dir,data_ver,n),"r") as handle:
        # Iterate over batch n, pulling out relevant information and cleaning each value
        data = json.load(handle)
        places = {}
        persons = {}
        publishers = {}
        ISBNs = {}
        #ret_data = np.empty(dtype=object,shape=(100000,10))
        index = 0
        #queue = deque()
        ret_data = deque()
        for row in data:
            place = cleanData(row.get('place'),"Place")
            ISBN = cleanData(row.get('editionISBN'), "ISBN")
            editionName = cleanData(row.get('editionTitle'), "Edition_Name")
            person = cleanData(row.get('person'), "Person")
            publisher = cleanData(row.get('publisher'), "Publisher")
            date = cleanData(row.get('editionDate'), "Date")
            if place[1] not in places:
                places[place[1]] = [place[0],0]
            if person[1] not in persons:
                persons[person[1]] = [person[0],0]
            if publisher[1] not in publishers:
                publishers[publisher[1]] = [publisher[0],0]
            if ISBN[1] not in ISBNs:
                ISBNs[ISBN[1]] = [ISBN[0],0]

            #print(place[1])
            #ret_data[index] = np.array([place[1],0,person[1],0,publisher[1],0,editionName[1],ISBN[1],0,date])
            ret_data.append([place[1],0,person[1],0,publisher[1],0,editionName,ISBN[1],0,date])
            #index += 1
            #print(ret_data)
        return ret_data,places,persons,publishers,ISBNs


'''
def indexData(data):
    # Re-index data based on global dictionaries 
    # Index 0 = Place, 2 = Person, 4 = Publisher, 3 = Edition_Name, 4 = ISBN, 5 = Date
    # Sub_Index 0 = Canonical Value, 1 = Puncutations removed
    
    for ix in range(0, data.shape[0]):
        try:
            if np.all(data[ix] == None):
                continue
            place_name,place_ID = places[data[ix][0]]
            person_name,person_ID = persons[data[ix][2]]
            publisher_name,publisher_ID = publishers[data[ix][4]]
            edition_name = data[ix][6][0]
            ISBN,ISBN_ID = ISBNs[data[ix][7]]
            date = data[ix][9]
            data[ix] = np.array([place_name,place_ID,person_name,person_ID,publisher_name,publisher_ID,edition_name,ISBN,ISBN_ID,date])
        except:
            print(data[ix])
'''  
'''
def indexData(data):
    try:
        if np.all(data == None):
            return data
        place_name,place_ID = places[data[0]]
        person_name,person_ID = persons[data[2]]
        publisher_name,publisher_ID = publishers[data[4]]
        edition_name = data[6]
        ISBN,ISBN_ID = ISBNs[data[7]]
        date = data[9]
        data = np.array([place_name,place_ID,person_name,person_ID,publisher_name,publisher_ID,edition_name,ISBN,ISBN_ID,date])
        return data
    except:
        print(data)
'''

def dequeData(queue):
    big_data = []
    while(len(queue) > 1):
       data = queue.pop()
       place_name,place_ID = places[data[0]]
       person_name,person_ID = persons[data[2]]
       publisher_name,publisher_ID = publishers[data[4]]
       edition_name = data[6]
       ISBN,ISBN_ID = ISBNs[data[7]]
       date = data[9]
       data = [place_name,place_ID,person_name,person_ID,publisher_name,publisher_ID,edition_name,ISBN,ISBN_ID,date]
       big_data.append(data)
    return big_data


def enum_list(conn,counter,field_dict):
    for key,value in field_dict.items():
        value[1] = counter
        field_dict[key] = value
        counter += 1

    conn.send(field_dict)
    conn.close()

if __name__ == "__main__":
    pool = Pool()
    places = {}
    persons = {}
    publishers = {}
    ISBNs = {}
    b_numbers = 20
    #ret_data = np.empty(dtype=object,shape=(b_numbers*100000,10))

    start_time = time()
    # Get rows to be loaded into Pandas along with individual
    # lists of unique elements
    index = 0
    ret_data = deque()
    for rd,pl,pe,pu,ib in pool.map(loadData, range(b_numbers)):
        #np.put(ret_data, range(index,index+100000), rd)
        ret_data += rd
        places.update(pl)
        persons.update(pe)
        publishers.update(pu)
        ISBNs.update(ib)
        #index += 100000

    print("Init extract took: {}".format(time() - start_time))



    # Convert each of these lists into dictionaries with ID values
    # Removes all exact duplicates
    p1_conn, c1_conn = Pipe()
    p1 = Process(target=enum_list, args=(c1_conn,0,places))
    p2_conn, c2_conn = Pipe()
    p2 = Process(target=enum_list, args=(c2_conn,10000000,persons))
    p3_conn, c3_conn = Pipe()
    p3 = Process(target=enum_list, args=(c3_conn,20000000,ISBNs))
    p4_conn, c4_conn = Pipe()
    p4 = Process(target=enum_list, args=(c4_conn,30000000,publishers))

    start_time = time()
    p1.start()
    p2.start()
    p3.start()
    p4.start()

    places = p1_conn.recv()
    persons = p2_conn.recv()
    ISBNs = p3_conn.recv()
    publishers = p4_conn.recv()
    print("Indexing data took: {}".format(time() - start_time))
    p1.join()
    p2.join()
    p3.join()
    p4.join()

    '''
    data_dict = data_dicts(place_dict=place_dict,person_dict=person_dict,ISBN_dict=ISBN_dict,publisher_dict=publisher_dict)
    del place_dict
    del person_dict
    del ISBN_dict
    del publisher_dict
    '''


    def map_to_index(data):
        return [indexData(x) for x in data]

    #pool = Pool(processes=2) 
    #print(places)
    start_time = time()
    # Re-index the inital list-of-lists
    #np.concatenate((indexed_list, np.array([indexData(x) for x in ret_data])))
    #indexed_list = autojit(map_to_index(ret_data))
    #np.apply_along_axis(indexData, 1, ret_data)
    #del ret_data
    ret_data = dequeData(ret_data)
    del places
    del persons
    del ISBNs
    del publishers
    print("Re-indexing took: {}".format(time() - start_time))
    pool.close()
    pool.terminate()
    pool.join()

    #start_time = time()
    # Load data into Pandas Dataframe
    df = pd.DataFrame(ret_data,columns=['Place_Name','Place_ID','Person_Name','Person_ID','Publisher_Name','Publisher_ID','Edition_Name','ISBN','Edition_ID','Date'])
    #print("Constructing DF took {}".format(time() - start_time))

    #del ret_data
    # Save to HDF5 file format
    #df.to_hdf('{}/data/binary/{}/loc_20.h5'.format(webc_dir,data_ver), key='df', mode='w')
