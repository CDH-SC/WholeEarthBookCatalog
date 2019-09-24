import csv

TSV = 'viaf.tsv'

# open all of the table files
personTable = open("sqlprep/personTable.tsv", 'w')
aliasesTable = open("sqlprep/aliasesTable.tsv", 'w')
normNamesTable = open("sqlprep/normNamesTable.tsv", 'w')
coAuthorTable = open("sqlprep/coAuthorTable.tsv", 'w')
pubTable = open("sqlprep/pubTable.tsv", 'w')
titlesTable = open("sqlprep/titlesTable.tsv", 'w')
isbnsTable = open("sqlprep/isbnsTable.tsv", 'w')
countriesTable = open("sqlprep/countriesTable.tsv", 'w')

# write headers for each file
personTable.write("id\ttype\tname\tstart\tend\tdateType\tnationality\n")
aliasesTable.write("id\tnames\n")
normNamesTable.write("id\tnormName\n")
coAuthorTable.write("id\tid_2\tcoAuth\n")
pubTable.write("id\tpub_id\tpublisher\n")
titlesTable.write("id\ttitle_id\ttitle\n")
isbnsTable.write("id\tisbn\n")
countriesTable.write("id\country_id\tcountry\n")

def stringToList(string):
    # parse string and return list
    l = []
    if string != "[]":
        l = string.split('\', \'')
        #print(l)
        length = len(l)
        first = l[0]
        last = l[length-1]
        if length != 1:
            print("first: " + first)
            print("last: " + last)
            l[0] = first[2:]
            length2 = length -2
            l[length-1] = last[0:-2]
            print(l[0])
            print(l[length-1] + "\n")
        else:
            print(l[0])
            l[0] = first[2:-2]
            print(l[0]+ "\n")
    return l

with open(TSV) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter='\t')
    count = 0
    for row in csv_reader:
        if count != 0:
            pID = row[0]
            pType = row[1]
            names = stringToList(row[2])
            normNames = stringToList(row[3])
            coAuth = stringToList(row[4])
            pubs = stringToList(row[5])
            isbn = stringToList(row[6])
            countries = stringToList(row[7])
            titles = stringToList(row[8])
            start = row[9]
            end = row[10]
            dType = row[11]
            nat = row[12]
            # write to person table
            personTable.write(str(pID) + "\t" + str(pType) + "\t" + str(names[0]) + "\t" + str(start) + "\t" + str(end) + "\t" + str(dType) + "\t" + str(nat) + "\n")
            count = 0;
            for name in names:
                if count > 0:
                    aliasesTable.write(str(pID) + "\t" + name + "\n")
                count = count +1
            for name in normNames:
                normNamesTable.write(str(pID) + "\t" + name + "\n")
            for author in coAuth:
                coAuthorTable.write(str(pID) + "\t0\t" + str(author)+ "\n")
            for pub in pubs:
                pubTable.write(str(pID) + "\t0\t" + pub+ "\n")
            for num in isbn:
                isbnsTable.write(str(pID) + "\t" + str(num)+ "\n")
            for country in countries:
                countriesTable.write(str(pID) + "\t0\t" + str(country) + "\n")
            for title in titles:
                titlesTable.write(str(pID) + "\t0\t" + str(title) + "\n")
        count = count + 1
    

