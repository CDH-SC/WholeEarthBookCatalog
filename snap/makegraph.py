import snap
import time
import os
import csv

def loadNodes(g, nodein):
    nodefile = open(nodein, "r")
    for row in nodefile:
        g.AddNode(int(row))

def loadRels(g, relin):
  with open(relin, 'rb') as relfile:
    fileReader = csv.reader(relfile, delimiter='\t')
    for row in fileReader:
        g.AddEdge(int(row[0]), int(row[1]))

def outputGraph(graph_name, g, output_dir):
    if not os.path.exists(output_dir):
      os.makedirs(output_dir)
    outputPath = os.path.join(output_dir, graph_name)
    print "Saved in: %s" % outputPath
    FOut = snap.TFOut(outputPath)
    g.Save(FOut)
    FOut.Flush()

# This loads the graph in from the saved import that was conducted in dhc_dataimp.py
nodes = { }
nodefile = "../../../json/data/combined/combined_batch.tsv"
nodein = "nodeout_15to17.txt"
relin = "relout_15to17.txt"
g = snap.TNGraph.New()
loadNodes(g, nodein)
loadRels(g, relin)
outputGraph("15to1700s_graph", g, "graph/")
