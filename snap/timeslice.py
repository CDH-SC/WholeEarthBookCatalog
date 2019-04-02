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

def timeslice(lower, upper, nodeout, relout):
    editionIDs = set()
    for NI in g.Nodes():
        if NI.GetId() >= 10000000 and NI.GetId() < 20000000:
            curr = nodes.get(NI.GetId())[2]
            if len(curr) == 4:
                try:
                    curr = int(curr)
                    if curr >= lower and curr <= upper:
                        editionIDs.add(NI.GetId())
                except:
                    pass
            elif "\xe2" in curr:
                try:
                    curr1 = int(curr[0:3])
                    curr2 = int(curr[5:8])
                    if curr1 >= lower and curr1 <= upper:
                        editionIDs.add(NI.GetId())
                    if curr2 >= lower and curr2 <= upper:
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
nodeout = "nodeout_15to17.txt"
relout = "relout_15to17.txt"
timeslice(1500, 1799, nodeout, relout)
