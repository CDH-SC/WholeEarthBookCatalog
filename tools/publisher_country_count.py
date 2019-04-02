import csv
from collections import defaultdict
import json
import pprint

place_reader = csv.reader(open("/home/n4user/cleaned_data/place_batch.csv", "r"), delimiter='\t')
publisher_reader = csv.reader(open("home/n4user/cleaned_data/publisher_batch.csv", "r"), delimiter='\t')
edition_reader = csv.reader(open("/home/n4user/cleaned_data/edition_batch.csv", "r"), delimiter='\t')
author_reader = csv.reader(open("/home/n4user/cleaned_data/person_batch.csv", "r"), delimiter='\t')

year_count = {}
for i in range(1900,1961):
    year_count[i] = defaultdict(lambda: [set(),set(),set()])
with open("all.csv","r",encoding="mac_roman") as country_handle:
    country_reader = csv.reader(country_handle, delimiter=',')
    countries = {}
    for line in country_reader:
        countries[line[0]] = line[5]

curr_year_dict = []
for i in range(1900,1961):
    curr_dict = {}
    curr_dict["year"] = i
    curr_dict["countries"] = []
    for country,continent in countries.items():
        curr_dict["countries"].append({"continent":continent,"country": country, "editions": set(), "publishers": set(), "authors": set()})
    curr_year_dict.append(curr_dict)


while(True):
    try:
        curr_place = next(place_reader)[1]
        curr_publisher = next(publisher_reader)
        curr_edition = next(edition_reader)
        curr_author = next(author_reader)
        curr_year = curr_edition[-2]
    except:
        break

    try:
        if "›" in curr_edition[-2]:
            curr_year = int(curr_edition[-2].split('›')[0])
        else:
            curr_year = int(curr_edition[-2])
        if curr_year > 1900 and curr_year <= 1960:
            for index,country in enumerate(countries):
                if country in curr_place:
                    curr_year_dict[curr_year-1900]["countries"][index]["publishers"].add(curr_publisher[0])
                    curr_year_dict[curr_year-1900]["countries"][index]["editions"].add(curr_edition[0])
                    curr_year_dict[curr_year-1900]["countries"][index]["authors"].add(curr_author[0])

    except:
        pass


for index1,curr_dict in enumerate(curr_year_dict):
    for index2,country in enumerate(curr_dict["countries"]):
        try:
            curr_year_dict[index1]["countries"][index2]["editions"] = len(curr_year_dict[index1]["countries"][index2]["editions"])
            curr_year_dict[index1]["countries"][index2]["publishers"] = len(curr_year_dict[index1]["countries"][index2]["publishers"])
            curr_year_dict[index1]["countries"][index2]["authors"] = len(curr_year_dict[index1]["countries"][index2]["authors"])
        except:
            print (curr_year_dict[index1]["countries"][index2]["editions"])
            print (curr_year_dict[index1])


with open("data.json", "w") as handle:
    json.dump(curr_year_dict, handle)

#for year,value1 in year_count.items():
#    print("-------{}--------".format(year))
#    for key,value in value1.items():
#        print ("{}: publishers: {} editions: {} authors: {}".format(key,len(value[0]),len(value[1]),len(value[2])))
