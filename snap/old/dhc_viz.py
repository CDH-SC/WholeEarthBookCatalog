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
filename = "graph/dhc_1.graph"
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

labels = snap.TIntStrH()
for NI in DirectedNetwork.Nodes():
	labels[NI.GetId()] = str(NI.GetId())
snap.DrawGViz(DirectedNetwork, snap.gvlDot, "output.png", " ", labels)
