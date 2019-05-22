import snap
import csv
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

# This loads the graph in from the saved import that was conducted in dhc_dataimp.py

# timeslice: takes in two years, which will serve as a range of years, and two filenames, 
# nodeout and relout. All nodes that fall within the range of years will be printed to 
# nodeout, and all edges that have a node within the range will be printed to relout. 
def timeslice(lower, upper, nodeout, relout):
    # editionIDs is a set because editions could be listed twice, and we want all unique editions
    editionIDs = set()
    for NI in g.Nodes():
        # if the node is an edition do the following 
        if NI.GetId() >= 10000000 and NI.GetId() < 20000000:
            # nodes.get(NI.GetId())[2] refers to the year of a node 
            curr = nodes.get(NI.GetId())[2]
            # some year fields have multiple years in them, this if-elif block handles
            # these cases separately by checking if the year(s) fall into the range,
            # and adding them to the edition ID set if so
            
            # if the length of the year is four characters (field has only one year)
            if len(curr) == 4:
              # enclosed in try-catch for possibility that curr could be non-numeric
                try:
                    curr = int(curr)
                    # if year falls into range, add to editionID set
                    if curr >= lower and curr <= upper:
                        editionIDs.add(NI.GetId())
                except:
                    pass
            #  "\xe2" is the '-', this means the year field contains two years 
            elif "\xe2" in curr:
                try:
                    curr1 = int(curr[0:3])
                    curr2 = int(curr[5:8])
                    # if a year falls into range, add to editionID set
                    if curr1 >= lower and curr1 <= upper:
                        editionIDs.add(NI.GetId())
                    if curr2 >= lower and curr2 <= upper:
                        editionIDs.add(NI.GetId())
                except:
                    pass
    relIDs = set()
    file2 = open(relout, "w")
    for EI in g.Edges():
        # check both source and destination of the edge to see if they're part of 
        # the set constructed above, this will indicate whether the edition
        # itself is from the year range
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
    
    # take all the nodes that are in editionIDs or relIDs as a precaution (or the sets)
    editionIDs = editionIDs | relIDs
    # this is your final node output
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
# sample years
timeslice(1500, 1799, nodeout, relout)
