import snap
import time
import os
import csv

# functions
###################################################################
def loadNodes(nodefile):
  with open(nodefile,'rb') as nodefile:
    fileReader = csv.DictReader(nodefile)
    for row in fileReader:
          print row[0]

# main:
###################################################################
#multigraph = snap.TNEANet.New()
#context = snap.TTableContext()
nodefile = "../../../json/data/compiled/node_batch.csv"
relfile = "../../../json/data/compiled/rel_batch.csv"

nodes = { }
'''
for i in range(0, 10):
  key = i
  value = [50 + i, 10, 8]
  nodes.update({key:value})
print nodes.get(0)
'''

print "loading... ..." 
with open(nodefile,'rb') as nodefile:
  fileReader = csv.reader(nodefile, delimiter='\t')
  for row in fileReader:
    key = row[0]
    value = row[1:]
    nodes.update({key:value})
print nodes.get('6596')
