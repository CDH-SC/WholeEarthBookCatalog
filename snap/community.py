import snap
import csv
from collections import defaultdict

# loadNodes: loads all nodes into dictionary for access in const time in the next step
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

# This loads a graph or subgraph in 
filename = "graph/15to1700s_graph"
nodefile = "../../../json/data/combined/combined_batch.tsv"
rankfile = "15to1700ranks.txt"
nodes = { }
loadNodes(nodes, nodefile)
FIn = snap.TFIn(filename)
g = snap.TNGraph.Load(FIn)
g = snap.ConvertGraph(snap.PUNGraph, g)

# conduct community analysis on a subgraph created previously 
CmtyV = snap.TCnComV()
modularity = snap.CommunityCNM(g, CmtyV)
cnt = 0
size = 0
commSize = defaultdict(int)

# print the output, specifically including the size of the community and each node's type (for future filtering)
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
# sort communities from largest to smallest and print to rank file
sort = sorted(commSize, key=commSize.get, reverse=True)
f = open(rankfile, "w")
f.write("Ranking by Community Size\n")
for num in range(0, len(commSize)):
    f.write("%s: %s\n" % (sort[num], commSize[sort[num]]))
f.close()
#print "The modularity of the network is %f" % modularity
