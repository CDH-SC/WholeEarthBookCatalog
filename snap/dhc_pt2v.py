import snap
import time

print "Loading file .... "

# This loads the graph in from the saved import that was conducted in dhc_dataimp.py
filename = "graph/dhc_1.graph"
FIn = snap.TFIn(filename)
mmnet = snap.TMMNet.Load(FIn)

# Tests to see if file loaded correctly
print 'Modes: %d' % mmnet.GetModeNets()
print 'Link types: %d' % mmnet.GetCrossNets()

# Converting network into directed network
print "Converting network into a directed network..."
crossnetids = snap.TIntV()
crossneti = mmnet.BegCrossNetI()
while crossneti < mmnet.EndCrossNetI():
    crossnetids.Add(crossneti.GetCrossId())
    crossneti.Next()
        
nodeattrmapping = snap.TIntStrStrTrV()
edgeattrmapping = snap.TIntStrStrTrV()
    
start_time = time.time()
DirectedNetwork = mmnet.ToNetwork(crossnetids, nodeattrmapping, edgeattrmapping)
end_time = time.time()
print "Converting to TNEANet  takes %s seconds" % (end_time - start_time)
 

NodeI = DirectedNetwork.GetNI(3)
print DirectedNetwork.GetStrAttrDatN(NodeI, "name") 



'''
# Stuff that works

# print "Getting basic network info"
# snap.PrintInfo(DirectedNetwork, "Cool graph")

print "Diameter %d" % snap.GetBfsFullDiam(DirectedNetwork, 10)
# print "Calculating shortest path..."
# Length = snap.GetShortPath(DirectedNetwork, 1, 100)
# print "Shortest Path from node 1 to node 100 is %d edges" % Length

print "Calculating bfs..."
diam = snap.GetBfsFullDiam(DirectedNetwork, 100, False)
print diam

# Stuff that works but doesn't mean anything
print "Getting modularity..."
Nodes = snap.TIntV()
Network = snap.GenRndGnm(snap.PNEANet, 100, 1000)
print snap.GetModularity(DirectedNetwork, Nodes, 1000)

print "Getting number of reciprocal edges..."
results = snap.GetEdgesInOut(DirectedNetwork, Nodes)
print "EdgesIn: %s EdgesOut: %s" % (results[0], results[1])

# Stuff that takes a long time but worth testing

# Printing extensive network statistics--- took too long
snap.PrintInfo(DirectedNetwork, "Cool graph", "/dev/stdout", False)

print "Trying to get some triangles...."
# takes very long and I am impatient but it should eventually work
TriadCntV = snap.TIntPrV()
snap.GetTriadParticip(DirectedNetwork, TriadCntV)
for pair in TriadCntV:
    print pair.Val1(), pair.Val2()

'''
