import snap

edgefilename = "/path/to/edges.txt"  # A file containing the graph, where each row contains an edge
                                     # and each edge is represented with the source and dest node ids,
                                     # and the edge attributes, separated by a tab.

nodefilename = "/path/to/nodes.txt"  # A file containing the nodes of a graph. Each row contains a node id,
                                     # and (optionally) node attributes.


context = snap.TTableContext()  # When loading strings from different files, it is important to use the same context
                                # so that SNAP knows that the same string has been seen before in another table.

edgeschema = snap.Schema()
edgeschema.Add(snap.TStrTAttrPr("PUBLISHED", snap.atStr))
edgeschema.Add(snap.TStrTAttrPr("PUBLISHED_IN", snap.atStr))
edgeschema.Add(snap.TStrTAttrPr("WROTE", snap.atStr))

nodeschema = snap.Schema()
nodeschema.Add(snap.TStrTAttrPr("Edition", snap.atStr))
nodeschema.Add(snap.TStrTAttrPr("Person", snap.atStr))
nodeschema.Add(snap.TStrTAttrPr("Place", snap.atStr))
nodeschema.Add(snap.TStrTAttrPr("Publisher", snap.atStr))

edge_table = snap.TTable.LoadSS(edgeschema, edgefilename, context, ",", snap.TBool(False))
node_table = snap.TTable.LoadSS(nodeschema, nodefilename, context, ",", snap.TBool(False))

# In this example, we add both edge attributes to the network, but only one node attribute.
edgeattrv = snap.TStrV()
edgeattrv.Add("edgeattr1")
edgeattrv.Add("edgeattr2")

nodeattrv = snap.TStrV()
nodeattrv.Add("nodeattr1")

# net will be an object of type snap.PNEANet
net = snap.ToNetwork(snap.PNEANet, edge_table, "srcID", "dstID", edgeattrv, node_table, "nodeID", nodeattrv, snap.aaFirst)

