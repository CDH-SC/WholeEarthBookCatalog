import csv
from load_all import *
import pprint

country_data = "{}/data/csv/{}/all.csv".format(os.environ['WEBC_DIR'],os.environ['DATA_VER'])
with open(country_data,"r") as handle:
    data = csv.reader(handle, delimiter=",")
    countries = {}
    for row in data:
        countries[row[0].strip()] = 0

pp = pprint.PrettyPrinter(indent=2) 
for country,_ in countries.items():
    count = big_df[big_df['Place_Name'].fillna('').map(lambda x: x.endswith(country))].shape[0]
    countries[country] = count
    print("Country: {} Publications: {}".format(country,count))
pp.pprint(countries)

