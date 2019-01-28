import snap
import random 
import time

print "it's graph time"
#starts timer to test for total runtime
start = time.time()

print "first, a simple directed graph"
# create the graph object
G1 = snap.TNGraph.New()

# sizes for testing the graph 
smol = 10 
big = 17000000

# add nodes passing in the size parameter (smol or big)
for i in range(1,big):
	G1.AddNode(i)
# generates a certain number of random numbers to use as edges
for i in range(1,big):
	x = random.randint(1,big-1)
	y = random.randint(1,big-1)
	# if the edge isn't pointing to itself
	if x != y:
		G1.AddEdge(x, y)
stop_build = time.time()
print "\tthe build time is: %f seconds" %(stop_build - start)
print "okay here it is!!"
# prints out the number of nodes and edges 
print "G1: Nodes %d, Edges %d" % (G1.GetNodes(), G1.GetEdges())

# if uncommented, this section will print out all of nodes 
# and the connections between each of the nodes (using the edges)
'''
# traverse the nodes
for NI in G1.Nodes():
	print "node id %d with out-degree %d and in-degree %d" % (
	NI.GetId(), NI.GetOutDeg(), NI.GetInDeg())
# traverse the edges
for EI in G1.Edges():
	print "edge (%d, %d)" % (EI.GetSrcNId(), EI.GetDstNId())
'''

print "\nokay time for testing algos!"

# shortest path between the second and third argument passed in 
start_sp = time.time()
shortpath = snap.GetShortPath(G1, 1, 4)
print "\nshortest path from 1 to 4 is %d edges" % shortpath
stop_sp = time.time()
print "\ttime to calculate shortest path: %f second" % (stop_sp - start_sp)
'''
print "let's try using the Complex version of the shortest path algo"
NIdToDistH = snap.TIntH()
shortestPath = snap.GetShortPath(G1, 4, NIdToDistH)
print "trying this thing using 3 as the src node"
for item in NIdToDistH:
    print item, NIdToDistH[item]
print "%d is the shortest possible path to all nodes!" % shortestPath
'''
print "\ntime to do a full bfs!"
print "this will give the diameter of the graph"
print "aka the longest distance between any pair of vertices"
# starts timer for bfs
start_bfs = time.time() 
diam = snap.GetBfsFullDiam(G1, 1, False)
print "the diam is %d" % diam
# stops timer for bfs
stop_bfs = time.time()
print "\tthe time to run bfs is %f seconds" % (stop_bfs - start_bfs)
'''
print "get nodes @ HOP = 2 starting from node 1!"
NodeVec = snap.TIntV()
snap.GetNodesAtHop(G1, 1, 2, NodeVec, True)
for item in NodeVec:
    print item 
'''
'''
print "page rank !!!"
PRankH = snap.TIntFltH()
snap.GetPageRank(G1, PRankH)
for item in PRankH:
    print item, PRankH[item]
''
print "time to detect some communities"
print "this ONLY WORKS ON UNDIRECTED GRAPHS"
CmtyV = snap.TCnComV()
modularity = snap.CommunityGirvanNewman(G1, CmtyV)
for Cmty in CmtyV:
    print "Community: "
    for NI in Cmty:
        print NI
print "The modularity of the network is %f" % modularity
'''
'''
print "\ntesting for triads and the clustering coefficient"
start_tri = time.time()
triad = snap.GetTriads(G1)
stop_tri = time.time()
print "Number of detected triads is %d" % triad
print "\ttime to caluculate num of triads: %f seconds" % (stop_tri - start_tri)

start_clust = time.time()
clustCf = snap.GetClustCf(G1)
stop_clust = time.time()
print "The clustering coefficient is %d" % clustCf
print"\ttime to calculate cluster coefficient: %f second" % (stop_clust - start_clust)
'''  
#stops total timer
stop = time.time()
print "\ttotal runtime: %1f seconds" % (stop-start)
