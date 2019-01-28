import snap
import csv

g = snap.TNGraph.New()

# holds string names for nodes
nodes = ['']
# holds type names for nodes
types = ['']

# interate through csv row by row
with open('test.csv', 'rb') as csvfile:
    fileReader = csv.DictReader(csvfile)
    for row in fileReader:
        name = row['Name']
        isbn = row['ISBN']
        year = row['Year']
        
        nodes.append(name)
        nodes.append(isbn)
        nodes.append(year)
        
	types.append("name")
        types.append("isbn")
        types.append("year")
	
# needs to check to see if node already exists!

        g.AddNode(nodes.index(name))
        g.AddNode(nodes.index(isbn))
        g.AddNode(nodes.index(year))
        
        g.AddEdge(nodes.index(name), nodes.index(isbn))
        g.AddEdge(nodes.index(name), nodes.index(year))
        g.AddEdge(nodes.index(isbn), nodes.index(year))

print "Iterating through nodes"
for NI in g.Nodes():
    print "%s: %s, id: %d" % (types[NI.GetId()], nodes[NI.GetId()], NI.GetId())

print "\nIterating through edges"
for EI in g.Edges():
    print "%s : %s - %s : %s" % (types[EI.GetSrcNId()], nodes[EI.GetSrcNId()], types[EI.GetDstNId()], nodes[EI.GetDstNId()])
