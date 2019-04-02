import snap
import csv
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

def placeslice(placeList, nodeout, relout):
    editionIDs = set()
    for place in placeList:
        for NI in g.Nodes():
            if NI.GetId() >= 0 and NI.GetId() < 10000000:
                curr = nodes.get(NI.GetId())[0]
                try:
                    if curr == place:
                        editionIDs.add(NI.GetId())
                except:
                    pass  

    relIDs = set()
    file2 = open(relout, "w")
    for EI in g.Edges():
        if EI.GetSrcNId() in editionIDs:
            wr1 = str(EI.GetSrcNId()) + "\t" + str(EI.GetDstNId()) + "\n"
            file2.write(wr1)
            relIDs.add(EI.GetDstNId())
        elif EI.GetDstNId() in editionIDs:
            wr2 = str(EI.GetSrcNId()) + "\t" + str(EI.GetDstNId()) + "\n"
            file2.write(wr2)
            relIDs.add(EI.GetSrcNId())
        else:
            continue
    file2.close()
    
    editionIDs = editionIDs | relIDs
    file1 = open(nodeout, "w")
    for ID in editionIDs:
        file1.write(str(ID) + "\n")
    file1.close()

filename = "graph/dhc_graph"
FIn = snap.TFIn(filename)
nodefile = "../../../json/data/combined/combined_batch.tsv"
g = snap.TNGraph.Load(FIn)
nodes = { }
loadNodes(nodes, nodefile)
nodeout = "nodeout_germany.txt"
relout = "relout_germany.txt"
placeList = ["Berlin", "Leipzig", "Frankfurt"]
placeslice(placeList, nodeout, relout)
