import csv
import pickle
with open('/home/n4user/json/cleaned_data/csv/abbrevs.csv','r') as handle:
    data = csv.reader(handle, delimiter='\t')
    abbrevs = [x for x in data]
us_abbrevs = ['USA','U.S.A.','U.S.A','United States','US']

place_mapping = {}
for x in abbrevs:
    curr = []
    for y in x:
        for z in us_abbrevs:
            curr.append("{}, {}".format(y.strip(),z))
            if len(y) == 2:
                curr.append("{}., {}".format('.'.join(list(y.strip())),z))
                curr.append("{}, {}".format('.'.join(list(y.strip())),z))

    for item in curr:
        place_mapping[item] = curr[3]
    place_mapping[y] = curr[3]
    place_mapping[".".join(list(y))] = curr[3]
    place_mapping["{}.".format(".".join(list(y)))] = curr[3]

manual_mappings = 
{
        "Fla": "Florida, United States",
        "Mich": "Michigan, United States",
        "Wis": "Wisconsin, United States"
}

for key,value in manual_mappings.items():
    place_mapping[key] = value


with open('/home/n4user/json/cleaned_data/binary/place_abbrevs.pickle','wb') as handle:
    pickle.dump(place_mapping, handle, protocol=pickle.HIGHEST_PROTOCOL)

