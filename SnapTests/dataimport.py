import snap
import time
import os
import csv
# functions
###################################################################
def loadNodes(g, nodes, nodefile):
  with open(nodefile,'rb') as nodefile:
    fileReader = csv.reader(nodefile, delimiter='\t')
    for row in fileReader:
      key = int(row[0])
# if the node is not already in the dict + graph, add it
      if nodes.get(key, -1) == -1:
        value = row[1:]
        if value != "None":
            nodes.update({key:value})
            g.AddNode(key)

def loadRels(g, nodes, relfile):
  with open(relfile, 'rb') as relfile:
    fileReader = csv.reader(relfile, delimiter='\t')
    for row in fileReader:
        if nodes.get(int(row[0]))[0] != "None" and nodes.get(int(row[1]))[0] != "None":
            g.AddEdge(int(row[0]), int(row[1]))

def outputGraph(graph_name, g, output_dir):
    if not os.path.exists(output_dir):
      os.makedirs(output_dir)
    outputPath = os.path.join(output_dir, graph_name)
    print "Saved in: %s" % outputPath
    FOut = snap.TFOut(outputPath)
    g.Save(FOut)
    FOut.Flush()

# main:
###################################################################
nodefile = "../../../json/data/combined/combined_batch.tsv"
relfile = "../../../json/data/combined/combined_rel_batch.tsv"

print "loading... ..."

nodes = { }
g = snap.TNGraph.New()
loadNodes(g, nodes, nodefile)
loadRels(g, nodes, relfile)
#outputGraph("dhc_graph1", g, "graph/")
print "Number of nodes: " + str(g.GetNodes())
print "Number of edges: " + str(g.GetEdges())

print "Iterating through nodes"
for NI in g.Nodes():
    if NI.GetId() >= 10000000 and NI.GetId() < 20000000:
        print "%s: %s" % (NI.GetId(), nodes.get(NI.GetId())[2])
'''
print "\nIterating through edges"
for EI in g.Edges():
  print "from %s (%s) to %s (%s)" % (EI.GetSrcNId(), nodes.get(int(EI.GetSrcNId()))[0], 
                                     EI.GetDstNId(), nodes.get(int(EI.GetDstNId()))[0])
'''
