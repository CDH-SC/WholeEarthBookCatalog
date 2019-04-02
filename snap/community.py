import snap
import csv
from collections import defaultdict

def loadNodes(nodes, nodefile):
  with open(nodefile,'rb') as nodefile:
    fileReader = csv.reader(nodefile, delimiter='\t')
    for row in fileReader:
      key = int(row[0])
# if the node is not already in the dict + graph, add it
      if nodes.get(key, -1) == -1:
        value = row[1:]
        nodes.update({key:value})
#        g.AddNode(key)

# This loads the graph in from the saved import that was conducted in dhc_dataimp.py
filename = "graph/15to1700s_graph"
nodefile = "../../../json/data/combined/combined_batch.tsv"
rankfile = "15to1700ranks.txt"
nodes = { }
loadNodes(nodes, nodefile)
FIn = snap.TFIn(filename)
g = snap.TNGraph.Load(FIn)
g = snap.ConvertGraph(snap.PUNGraph, g)

CmtyV = snap.TCnComV()
modularity = snap.CommunityCNM(g, CmtyV)
cnt = 0
size = 0
commSize = defaultdict(int)

for Cmty in CmtyV:
    print "Community: " + str(cnt)
    size = 0
    for NI in Cmty:
            nodeType = "None"
            if NI >= 0 and NI < 10000000:
                nodeType = "Place"
            elif NI >= 10000000 and NI < 20000000:
                nodeType = "Edition"
            elif NI >= 20000000 and NI < 30000000:
                nodeType = "Publisher"
            elif NI >= 30000000 and NI < 40000000:
                nodeType = "Person"
            print str(NI) + ": " + nodes.get(NI)[0] + " (" + nodeType + ")"
            size += 1
    commSize[cnt] = size
    cnt += 1
sort = sorted(commSize, key=commSize.get, reverse=True)
f = open(rankfile, "w")
f.write("Ranking by Community Size\n")
for num in range(0, len(commSize)):
    f.write("%s: %s\n" % (sort[num], commSize[sort[num]]))
f.close()
#print "The modularity of the network is %f" % modularity
