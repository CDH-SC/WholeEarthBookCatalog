import snap
import gc
import sys
import StringIO

most_frequent = lambda dframe,field: dframe[field].mode().values[0]
setdex = lambda dframe,field: dframe.set_index(field, drop=False, inplace=True)


# Takes a dataframe and generates a snap graph
def gensnapgraph(dframe):
    # Really ugly way to do this, but slightly faster than alternatives. 
    g = snap.TNGraph.New()
    idmap = {'Person_ID': 0, 'Publisher_ID': 2, 'Edition_ID': 4, 'Place_ID': 8}
    rels = [[idmap['Person_ID'],idmap['Edition_ID']],[idmap['Publisher_ID'],idmap['Place_ID']],[idmap['Publisher_ID'],idmap['Edition_ID']]]
    seen = set()
    for row in dframe.values.tolist():
        if row[0] not in seen: 
            g.AddNode(row[0])
            seen.add(row[0])
        if row[2] not in seen:
            g.AddNode(row[2])
            seen.add(row[2])
        if row[4] not in seen:
            g.AddNode(row[4])
            seen.add(row[4])
        if row[8] not in seen:
            g.AddNode(row[8])
            seen.add(row[8])
        for rel in rels:
            if (row[rel[0]],row[rel[1]]) not in seen:
                g.AddEdge(row[rel[0]],row[rel[1]])
                seen.add((row[rel[0]],row[rel[1]]))
    return g 

# Takes an existing graph, a list of ID values, and an n degrees of freedom
# and generates a subgraph with all the ids and all the nodes n degrees of freedom
# away from those ids 
def genndsubgraph(graph,ids,dof=0):
    pass


# Takes a dataframe and generates a graph tool graph
def gengtoolgraph(dframe):
    idmap = {'Person_ID': 0, 'Publisher_ID': 2, 'Edition_ID': 4, 'Place_ID': 8}
    rels = [[idmap['Person_ID'],idmap['Edition_ID']],[idmap['Publisher_ID'],idmap['Place_ID']],[idmap['Publisher_ID'],idmap['Edition_ID']]]
    nodes = set()
    rels = set()
    for row in dframe.values.tolist():
        nodes.add(row[0])
        nodes.add(row[2])
        nodes.add(row[4])
        nodes.add(row[8])

    del dframe
    gc.collect()
    g = Graph(list(rels))


    return g 


# Saves a graph to a binary file
def outputGraph(graph_name, g, output_dir):
    if not os.path.exists(output_dir):
      os.makedirs(output_dir)
    outputPath = os.path.join(output_dir, graph_name)
    print ("Saved in: %s" % outputPath)
    FOut = snap.TFOut(outputPath)
    g.Save(FOut)
    FOut.Flush()

'''
Example usage for generating a subgraph of paris between 1710 and 1799

for i in range(10,99):
    stdout = sys.stdout
    text = StringIO.StringIO()
    sys.stdout = text
    q_string = 'Place_Name == "Paris" and Date == 17{}'.format(i) 
    g = gensnapgraph(big_df.query(q_string))
    print("QUERY: {}".format(q_strin))
    snap.PrintInfo(g)
    #print(text)
'''
