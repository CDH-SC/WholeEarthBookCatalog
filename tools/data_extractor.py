#!/usr/bin/python3
from multiprocessing import Pool,Process,Pipe
import pandas as pd
import numpy
import json
import os
from time import time
from distance_test import *
from nlp.datacleaning import *
import string

webc_dir = os.environ['WEBC_DIR']
data_ver =os.environ['DATA_VER']

def loadData(n):
    with open("{}/data//json/{}/batch{}.json".format(webc_dir,data_ver,n),"r") as handle:
        data = json.load(handle)
        places = set()
        persons = set()
        publishers = set()
        isbns = set()
        ret_data = []
        for row in data:
           
            place = cleanData(row.get('place'))
            isbn = cleanData(row.get('editionISBN'))
            editionName = cleanData(row.get('editionName'))
            person = cleanData(row.get('person'))
            publisher = cleanData(row.get('publisher'))
            date = cleanDate(row.get('editionDate'))
            places.add(place)
            persons.add(person)
            publishers.add(publisher)
            isbns.add(isbn)
            ret_data.append([place,person,publisher,editionName,isbn,date]) 

        return ret_data,places,persons,publishers,isbns


def indexData(data):
    return [data[0],place_dict[data[0]],data[1],person_dict[data[1]],data[2],publisher_dict[data[2]],data[3],data[4],isbn_dict[data[4]],data[5]]

def enum_list(conn,data,counter,data_dict):
    for item in data:
        if item not in data_dict:

            data_dict[item] = counter
            counter += 1

    conn.send(data_dict)
    conn.close()

if __name__ == "__main__":
    pool = Pool()
    batches = []
    places = []
    persons =[]
    publishers = []
    isbns = []
    #pool = Pool(initializer=init, initargs=(pl_dict,pl_counter,pe_dict,pe_counter,pu_dict,pu_counter,e_dict,e_counter,))
    #batches = [['/home/n4user/json/',x] for x in list(range(118))]
    ret_data = []

    start_time = time()
    for rd,pl,pe,pu,ib in pool.map(loadData, range(20)):
        ret_data += rd
        places += pl
        persons += pe
        publishers += pu
        isbns += ib
    print("Init extract took: {}".format(time() - start_time))

    place_dict = {}
    publisher_dict = {}
    person_dict = {}
    isbn_dict = {}

    counter = 0
    p1_conn, c1_conn = Pipe()
    p1 = Process(target=enum_list, args=(c1_conn,places,0,place_dict))
    p2_conn, c2_conn = Pipe()
    p2 = Process(target=enum_list, args=(c2_conn,persons,10000000,person_dict))
    p3_conn, c3_conn = Pipe()
    p3 = Process(target=enum_list, args=(c3_conn,isbns,20000000,isbn_dict))
    p4_conn, c4_conn = Pipe()
    p4 = Process(target=enum_list, args=(c4_conn,publishers,30000000,publisher_dict))

    start_time = time()
    p1.start()
    p2.start()
    p3.start()
    p4.start()

    place_dict = p1_conn.recv()
    person_dict = p2_conn.recv()
    isbn_dict = p3_conn.recv()
    publisher_dict = p4_conn.recv()
    print("Indexing data took: {}".format(time() - start_time))
    p1.join()
    p2.join()
    p3.join()
    p4.join()

    del places
    del persons
    del isbns
    del publishers


    pool = Pool() 
    indexed_list = []
    start_time = time()
    indexed_list += pool.map(indexData, ret_data)
    print("Re-indexing took: {}".format(time() - start_time))
    start_time = time()
    del place_dict
    del person_dict
    del isbn_dict
    del publisher_dict
    pool.close()
    pool.terminate()
    pool.join()
    print("Deleting data took: {}".format(time() - start_time))

    start_time = time()
    df = pd.DataFrame(indexed_list,columns=['Place_Name','Place_ID','Person_Name','Person_ID','Publisher_Name','Publisher_ID','Edition_Name','ISBN','Edition_ID','Date'])
    print("Constructing DF took {}".format(time() - start_time))
    #df.to_hdf('{}/data/binary/{}/loc_20.h5'.format(webc_dir,data_ver), key='df', mode='w')
