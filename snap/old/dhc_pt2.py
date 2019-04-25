import snap
import time


# See utils/networkutils.py in the Mambo Github for the following two functions
# This function, which comes from the Mambo tutorials on Github, gets the number
# of elements in each mode of the network
def get_num_elem_per_mode(Graph):
    mode_num_elem = {}
    modeneti = Graph.BegModeNetI()
    while modeneti < Graph.EndModeNetI():
        name = Graph.GetModeName(modeneti.GetModeId())
        modeNet = modeneti.GetModeNet()
        mode_num_elem[name] = modeNet.GetNodes()
        modeneti.Next()
    return mode_num_elem

# This function, which comes from the Mambo tutorials on Github, gets the number
# of elements for each edge type in the network
def get_num_elem_per_link(Graph):
    link_num_elem = {}
    crossnetids = snap.TIntV()
    crossneti = Graph.BegCrossNetI()
    while crossneti < Graph.EndCrossNetI():
        crossnetids.Add(crossneti.GetCrossId())
        name = Graph.GetCrossName(crossneti.GetCrossId())
        crossnet = crossneti.GetCrossNet()
        link_num_elem[name] = crossnet.GetEdges()
        crossneti.Next()
    return link_num_elem

# This loads the graph in from the saved import that was conducted in dhc_dataimp.py
filename = "graph/dhc_person.graph"
FIn = snap.TFIn(filename)
mmnet = snap.TMMNet.Load(FIn)

# Number of modes and their respective number of elements
print 'Modes: %d' % mmnet.GetModeNets()
num_elem_per_mode = get_num_elem_per_mode(mmnet)
print '\n'.join(map(str, num_elem_per_mode.items()))

# Number of relationships and their respective number of elements
print 'Link types: %d' % mmnet.GetCrossNets()
link_num_elem = get_num_elem_per_link(mmnet)
print '\n'.join(map(str, link_num_elem.items()))

# The following three things that I honestly don't really understand are used
# to create the directed network 
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
print "Converting to TNEANet takes %s seconds" % (end_time - start_time)

node = DirectedNetwork.GetNI(DirectedNetwork.GetNodes()-5)
#for NI in range(DirectedNetwork.GetNodes()):
#        print "%s" % (NI.GetId())
#	node.Next()
"""
for EI in DirectedNetwork.Edges():
	print "%s --> %s" % (EI.GetSrcNId(), EI.GetDstNId())
# Currently trying to find algorithms that work on our set so that we can have
# something to show Colin here 
"""
"""
# These algos core dump for some reason 
GraphClustCoeff = snap.GetClustCf (DirectedNetwork, -1)
print "Clustering coefficient: %f" % GraphClustCoeff

# These work
# update: the number (currently 1000) has to increased for accuracy
# and when increased, it doesn't run fast 
#print "Diameter %d" % snap.GetBfsFullDiam(DirectedNetwork, 100)
#snap.PrintInfo(DirectedNetwork, "Python type PNEANet", "output.txt", False)
#map(lambda x: x.replace("\n", ""), open("output.txt").readlines())
CntV = snap.TIntPrV()
snap.GetWccSzCnt(DirectedNetwork, CntV)
sizestring = ""
for p in CntV:
    sizestring += "%d\t\t%d\n" % (p.GetVal1(), p.GetVal2())
print 'WCC Size\tCount'
print sizestring
"""
"""
PRankH = snap.TIntFltH()
topTen = [float("-inf")]
snap.GetPageRank(DirectedNetwork, PRankH)
for item in PRankH:
    print item, PRankH[item]
"""


