import snap
import os

def load_edition_to_graph(mode, filename, Graph, context):
    print "okay we are in the edition section"
    modeId = mode + 'ID'
    schema = snap.Schema()
    schema.Add(snap.TStrTAttrPr(modeId, snap.atStr))
    schema.Add(snap.TStrTAttrPr("isbn", snap.atStr))
    schema.Add(snap.TStrTAttrPr("title", snap.atStr))
    schema.Add(snap.TStrTAttrPr("year", snap.atStr))
    schema.Add(snap.TStrTAttrPr(mode, snap.atStr))
    nodeattrv = snap.TStrV()
    modenet = snap.TTable.LoadSS(schema, filename, context, "\t", snap.TBool(False))
    snap.LoadModeNetToNet(Graph, mode, modenet, modeId, nodeattrv)

def load_other_to_graph(mode, filename, Graph, context):
    print "okay we are in the " + mode + " section"
    modeId = mode + 'ID'
    schema = snap.Schema()
    schema.Add(snap.TStrTAttrPr(modeId, snap.atStr))
    schema.Add(snap.TStrTAttrPr("name", snap.atStr))
    schema.Add(snap.TStrTAttrPr(mode, snap.atStr))
    nodeattrv = snap.TStrV()
    modenet = snap.TTable.LoadSS(schema, filename, context, "\t", snap.TBool(False))
    snap.LoadModeNetToNet(Graph, mode, modenet, modeId, snap.TStrV())

def load_crossnet_to_graph(srcName, dstName, crossName, filepath, Graph, context):
    print crossName + ": the relationship between " + srcName + " and " + dstName
    srcId = srcName + "SrcId"
    dstId = dstName + "DstId"

    schema = snap.Schema()
    schema.Add(snap.TStrTAttrPr(srcId, snap.atStr))
    schema.Add(snap.TStrTAttrPr(dstId, snap.atStr))
    crossnet = snap.TTable.LoadSS(schema, filepath, context, "\t", snap.TBool(False))

    Graph.AddCrossNet(srcName, dstName, crossName, True)
    snap.LoadCrossNetToNet(Graph, srcName, dstName, crossName, crossnet, srcId, dstId, snap.TStrV())

def get_num_elem_per_mode(Graph):
    mode_num_elem = {}
    modeneti = Graph.BegModeNetI()
    while modeneti < Graph.EndModeNetI():
        name = Graph.GetModeName(modeneti.GetModeId())
        modeNet = modeneti.GetModeNet()
        mode_num_elem[name] = modeNet.GetNodes()
        modeneti.Next()
    return mode_num_elem

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


context = snap.TTableContext()
# Graph object to hold multimodal network
mmnet = snap.TMMNet.New()
path_name = "../../json/data1/"
filenames = [
     path_name + "edition_batch.csv",
     path_name + "person_batch.csv",
     path_name + "place_batch.csv",
     path_name + "publisher_batch.csv",
     path_name + "wrote_rel_batch.csv",
     path_name + "place_rel_batch.csv",
     path_name + "published_rel_batch.csv",
]
mode_names = ["edition", "person", "place", "publisher"]
load_edition_to_graph("edition", filenames[0], mmnet, context)
load_other_to_graph("person", filenames[1], mmnet, context)
load_other_to_graph("place", filenames[2], mmnet, context)
load_other_to_graph("publisher", filenames[3], mmnet, context)

print "number of modenets: "
print mmnet.GetModeNets()

load_crossnet_to_graph("person", "edition", "WROTE", filenames[4], mmnet, context)
load_crossnet_to_graph("edition", "place", "PUBLISHED IN", filenames[5], mmnet, context)
load_crossnet_to_graph("publisher", "edition", "PUBLISHED", filenames[6], mmnet, context)

print "number of crossnets: "
print mmnet.GetCrossNets()

output_dir = "graph"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
graph_name = "dhc_1.graph"
outputPath = os.path.join(output_dir, graph_name)
print "Saved in: %s" % outputPath
FOut = snap.TFOut(outputPath)
mmnet.Save(FOut)
FOut.Flush()


print 'Modes: %d' % mmnet.GetModeNets()
num_elem_per_mode = get_num_elem_per_mode(mmnet)
print '\n'.join(map(str, num_elem_per_mode.items()))

print 'Link types: %d' % mmnet.GetCrossNets()
link_num_elem = get_num_elem_per_link(mmnet)
print '\n'.join(map(str, link_num_elem.items()))
