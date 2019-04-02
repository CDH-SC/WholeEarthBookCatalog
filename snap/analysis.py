import snap
import csv
from collections import defaultdict

def relatedNodes(comfile, rankfile, ids, prefix):
    communities = []
    places = [] 
    pubs = []
    people = []
    ranks = []
    f = open(comfile).read().splitlines()
    curr = 0
    for line in f:
        if line.split(': ')[0] == "Community":
            curr = int(line.split(': ')[1])
            continue
        elif int(line.split(": ")[0]) in ids:
            communities.append(curr)

    comFlag = False
    for line in f:
        if line.split(": ")[0] == "Community":
            if int(line.split(": ")[1]) in communities:
                comFlag = True
                curr = int(line.split(': ')[1])
            else:
                comFlag = False
        elif comFlag: 
            split = line.split("(")
            lineType = split[len(split)-1]
            if lineType == "Person)":
                elem = (line, curr)
                people.append(elem)
            elif lineType == "Place)":
                elem = (line, curr)
                places.append(elem)
            elif lineType == "Publisher)":
                elem = (line, curr)
                pubs.append(elem)

    rankfile = open(rankfile).read().splitlines()
    for line in rankfile:
        currCom = int(line.split(": ")[0])
        currRank = int(line.split(": ")[1])
        if currCom in communities:
            rank = (currCom, currRank)
            ranks.append(rank)
    printOutput(communities, people, places, pubs, ranks, prefix)

def printOutput(communities, people, places, pubs, ranks, prefix):
    printHelp(people, prefix+"people.txt", "(Person)", 0)
    printHelp(places, prefix+"places.txt", "(Place)", 0)
    printHelp(pubs, prefix+"pubs.txt", "(Publisher)", 0)
    printHelp(people, prefix+"uniqpeople.txt", "(Person)", 1)
    printHelp(places, prefix+"uniqplaces.txt", "(Place)", 1)
    printHelp(pubs, prefix+"uniqpubs.txt", "(Publisher)", 1)
    printHelp(ranks, prefix+"ranks.txt", " ", 2) 


def printHelp(listo, filename, splitter, opt):
    if opt == 0:
        f = open(filename, "w")
        for p in listo:
            wr = str(p[1]) + "   ***   " + str(p[0].split(splitter)[0]) + "\n"
            f.write(wr)
        f.close()
    elif opt == 1:
        f = open(filename, "w")
        pSet = set(listo)
        for p in pSet:
            wr = str(p[0].split(splitter)[0]) + "\n"
            f.write(wr)
        f.close()
    else:
        f = open(filename, "w")
        for p in listo:
            wr = "Community " + str(p[1]) + " rank: " + str(p[0]) + "\n"
            f.write(wr)
        f.close()
    print("Printed to " + filename + ", size of " + str(len(listo)))


relatedNodes("15to1700community.txt", "15to1700ranks.txt", [36174101], "15to1700stest/")
