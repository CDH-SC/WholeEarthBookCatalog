import csv

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
aliasesTable.write("id\tnames\t")
normNamesTable.write("id\tnormNames\n")
coAuthorTable.write("id\tid_2\tcoAuth\n")
pubTable.write("id\tpub_id\tpublisher\n")
titlesTable.write("id\ttitle_id\ttitle\n")
isbnsTable.write("id\tisbn\n")
countriesTable.write("id\country_id\tcountry\n")

def stringToList(string):
    # parse string and return list
    l = []
    if string != "[]":
        pass
    return l

with open('small_viaf.tsv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter='\t')
    for row in csv_reader:
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
        for name in names:
            aliasesTable.write(str(pID) + "\t" + name + "\n")
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
        
