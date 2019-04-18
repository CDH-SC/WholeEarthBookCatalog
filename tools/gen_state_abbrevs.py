import csv
import pickle
def gen_US(place_mapping):
    with open('/home/n4user/json/cleaned_data/csv/us_abbrevs.txt','r') as handle:
        data = csv.reader(handle, delimiter='\t')
        abbrevs = [x for x in data]
    us_abbrevs = ['USA','U.S.A.','U.S.A','United States of America','United States','US']

    for x in abbrevs:
        curr = []
        for y in x:
            y = y.strip()
            if y == '':
                continue
            for z in us_abbrevs:
                curr.append("{}, {}".format(y.strip(),z))
                if len(y) == 2:
                    curr.append("{}., {}".format('.'.join(list(y.strip())),z))
                    curr.append("{}, {}".format('.'.join(list(y.strip())),z))

        
            place_mapping[y] = curr[3]
            place_mapping[".".join(list(y))] = curr[3]
            place_mapping["{}.".format(".".join(list(y)))] = curr[3]
        
        for item in curr:
            place_mapping[item] = curr[3]
    return place_mapping

def gen_DEU(place_mapping):
    with open('/home/n4user/json/cleaned_data/csv/deu_abbrevs.txt','r') as handle:
        states = [x[0] for x in csv.reader(handle)]
        for state in states:
            place_mapping[state] = "{}, Germany".format(state)
    return place_mapping

place_mapping = {}
place_mapping = gen_US(place_mapping)
place_mapping = gen_DEU(place_mapping)
with open('/home/n4user/json/cleaned_data/binary/place_abbrevs.pickle','wb') as handle:
    pickle.dump(place_mapping, handle, protocol=pickle.HIGHEST_PROTOCOL)

print (place_mapping)
