from multiprocessing import Pool
from xml.dom import minidom

import csv
import mmap
import time
import sys

#print(file.toprettyxml())

def getID(cluster):
    idNum = cluster.getElementsByTagName('viafID')[0]
    return idNum.firstChild.data

def getType(cluster):
    nameType = cluster.getElementsByTagName('nameType')[0]
    return nameType.firstChild.data

def getMainHeadings(cluster):
    namesList = []
    mainHeadings = cluster.getElementsByTagName('mainHeadings')
    # gets main headings before heading elements
    for el in mainHeadings:
        main = el.getElementsByTagName('data')
        for data in main:
            text = data.getElementsByTagName('text')[0]
            namesList.append(text.firstChild.data)
            #print(text.firstChild.data)
    return namesList

def getMHElements(cluster):
    namesList = []
    mainHeadings = cluster.getElementsByTagName('mainHeadings')
    for el in mainHeadings:
        #print('Main Heading Elements:')
        sections = el.getElementsByTagName('mainHeadingEl')
        for section in sections:
            #print('> Name: ')
            datafields = section.getElementsByTagName('subfield')
            for field in datafields:
                #print(field.firstChild.data)
                namesList.append(field.firstChild.data)
    return namesList

def getNormalizedNames(cluster):
    #print("Normalized names:")
    l = []
    x400s = cluster.getElementsByTagName('x400s')
    for x400 in x400s:
        datafield = x400.getElementsByTagName('datafield')
        for field in datafield:
            name = field.getElementsByTagName('normalized')[0]
            #print(name.firstChild.data)
            l.append(name.firstChild.data)
    return l

def getCoauthors(cluster):
    l = []
    # print("Coauthors:")
    coauthors = cluster.getElementsByTagName('coauthors')
    for author in coauthors:
        data = author.getElementsByTagName('data')
        for field in data:
            name = field.getElementsByTagName('text')[0]
            #print(name.firstChild.data)
            l.append(name.firstChild.data)
    return l

def getPublishers(cluster):
    # print("Publishers: ")
    l = []
    publishers = cluster.getElementsByTagName('publishers')
    for pub in publishers:
        data = pub.getElementsByTagName('data')
        for field in data:
            name = field.getElementsByTagName('text')[0]
            # print(name.firstChild.data)
            l.append(name.firstChild.data)
    return l

def getISBNs(cluster):
    # print("ISBNs:")
    l = []
    isbns = cluster.getElementsByTagName('ISBNs')
    for isbn in isbns:
        data = isbn.getElementsByTagName('data')
        for field in data:
            name = field.getElementsByTagName('text')[0]
            # print(name.firstChild.data)
            l.append(name.firstChild.data)
    return l

def getCountries(cluster):
    # print("Countries:")
    l = []
    countries = cluster.getElementsByTagName('countries')
    for country in countries:
        text = country.getElementsByTagName('text')[0]
        # print(text.firstChild.data)
        l.append(text.firstChild.data)
    return l

def getTitles(cluster):
    # print("Titles:")
    l = []
    titles = cluster.getElementsByTagName('titles')[0]
    works = titles.getElementsByTagName('work')
    for work in works:
        # print(">Work:")
        title = work.getElementsByTagName('title')[0]
        # print(title.firstChild.data)
        l.append(title.firstChild.data)
    return l

def getBirthDate(cluster):
    date = cluster.getElementsByTagName('birthDate')[0]
    return date.firstChild.data

def getDeathDate(cluster):
    date = cluster.getElementsByTagName('deathDate')[0]
    return date.firstChild.data

def getDateType(cluster):
    dType = cluster.getElementsByTagName('dateType')[0]
    return dType.firstChild.data

def getNationality(cluster):
    # print("")
    name = "00"
    natData = cluster.getElementsByTagName('nationalityOfEntity')
    for dat in natData:
        data = dat.getElementsByTagName('data')
        for field in data:
            name = field.getElementsByTagName('text')[0].firstChild.data
            # print(name.firstChild.data)
    return name

def xmlToTsv(xml_string):
    cluster = minidom.parseString(xml_string)
    t = getType(cluster)

    iD = getID(cluster)

    #print("Main Headings:")
    mh = getMainHeadings(cluster)

    #print("Main Heading Elements:")
    mhe = getMHElements(cluster)

    #combine mh and mhe into same list names

    names = []
    for i in mh:
        names.append(i)
    for i in mhe:
        names.append(i)
    #print(names)

    #print("Normalized Names:")
    nn = getNormalizedNames(cluster)
    #print(nn)
    #print("Coauthors:")
    ca = getCoauthors(cluster)

    #print("Publishers:")
    pub = getPublishers(cluster)

    #print("ISBNS:")
    isbn = getISBNs(cluster)

    #print("Countries:")
    country = getCountries(cluster)

    #print(country)

    #print("Titles:")
    titles = getTitles(cluster)

    #print("\n")

    birthDate = getBirthDate(cluster) # start date
    #print(birthDate)

    deathDate = getDeathDate(cluster) # end date
    #print(deathDate)

    dateType = getDateType(cluster)
    #print(dateType)

    nationality = getNationality(cluster)
    #print(nationality)

    curr_row = [str(x) for x in [iD, t, names, nn, ca, pub, isbn, country, titles, birthDate, deathDate, dateType, nationality]]

    return curr_row

# pool = Pool()
with open('/backup/viaf_download/viaf.xml', "r+b") as read_handle:
    with open('/backup/viaf_download/viaf.tsv', 'w') as write_handle:
        csv_writer = csv.writer(write_handle, delimiter="\t")
        header = ["ID", "Type", "Names", "NormNames", "CoAuth", "Publishers", "ISBN", "Country", "Titles", "StartDate", "EndDate", "DateType", "Nationality"]
        csv_writer.writerow(header)
        map_file = mmap.mmap(read_handle.fileno(), 0, prot=mmap.PROT_READ)
        chunk_data = []
        s_time = time.time()
        for line in iter(map_file.readline, b""):
            try:
                curr = xmlToTsv(line)
                chunk_data.append(curr)
            except:
                pass

            if len(chunk_data) >= 1000:
                print("1000 rows processing time: {}".format(time.time() - s_time))
                csv_writer.writerows(chunk_data)
                chunk_data = []


