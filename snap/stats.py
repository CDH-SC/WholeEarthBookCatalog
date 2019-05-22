import snap
# This loads the graph in from the saved import that was conducted in dataimport.py
filename = "graph/dhc_graph"
FIn = snap.TFIn(filename)
g = snap.TNGraph.Load(FIn)

snap.PrintInfo(g, "Python type PNGraph", "dhcinfoprint.txt", False)
