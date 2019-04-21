# -*- coding: utf-8 -*- 
import pandas as pd
import os
from pandas import HDFStore
from shutil import copyfile

def split(x):
    if "›" in x:
        return [int(x) for x in x.split("›")]
    else:
        try:
            return int(x)
        except:
            return x

## No longer necessary with new data extractor script 
def saveDF():
    person_batch_dir = '{}/data/csv/{}/person_batch.csv'.format(os.environ['WEBC_DIR',os.environ['DATA_VER']])
    publisher_batch_dir = '{}/data/csv/{}/place_batch.csv'.format(os.environ['WEBC_DIR'],os.environ['DATA_VER'])
    edition_batch_dir = '{}/data/csv/{}/edition_batch.csv'.format(os.environ['WEBC_DIR'],os.environ['DATA_VER'])
    place_batch_dir = '{}/data/csv/{}/place_batch.csv'.format(os.environ['WEBC_DIR'],os.environ['DATA_VER'])
    person_df = pd.read_csv(person_batch_dir, delimiter='\t',names=['Person_ID','Person_Name','Type'], usecols=['Person_ID', 'Person_Name'])
    publisher_df = pd.read_csv(publisher_batch_dir, delimiter='\t',names=['Publisher_ID','Publisher_Name','Type'], usecols=['Publisher_ID', 'Publisher_Name'])
    edition_df = pd.read_csv(edition_batch_dir, delimiter='\t',names=['Edition_ID', 'Edition_Name','ISBN','Date','Type'], usecols=['Edition_ID','ISBN','Edition_Name','Date'])
    place_df = pd.read_csv(place_batch_dir, delimiter='\t', names=['Place_ID','Place_Name','Type'], usecols=['Place_ID', 'Place_Name'])

    big_df = pd.concat([person_df,publisher_df,edition_df,place_df],axis=1)

    big_df['Date'] = big_df['Date'].map(lambda x: split(x))
    del person_df
    del publisher_df
    del edition_df
    del place_df

    hdf_dir = "{}/data/binary/{}/loc_df.h5".format(os.environ["WEBC_DIR"],os.environ["DATA_VER"])

    big_df.to_hdf(hdf_dir, 'df')

    return big_df

def split(x):
    if "›" in x:
        return [int(x) for x in x.split("›")][0]
    else:
        try:
            return int(x)
        except:
            return x

try:

    hdf_dir = "{}/data/binary/{}/loc_df.h5".format(os.environ["WEBC_DIR"],os.environ["DATA_VER"])
    big_df = pd.read_hdf(hdf_dir)

except:
    big_df = saveDF()
