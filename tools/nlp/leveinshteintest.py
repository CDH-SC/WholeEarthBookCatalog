from fuzzywuzzy import fuzz 
from multiprocessing import Process,cpu_count

titles = []
with open('edition_batch.csv', 'r') as data:
    for i in range(10000):
        current_row = data.readline().split("«")
        title = current_row[2]
        titles.append(title)

def fuzzycompare(start,skip):
    for i in range(start,len(titles),skip):
        for j in range(i+1, len(titles)):
            ratio = fuzz.ratio(titles[i],titles[j])
            if ratio > 95:
                print("------{}% Match------".format(ratio))
                print("A: {}".format(titles[i]))
                print("B: {}".format(titles[j]))

fuzzycompare(0,1)
