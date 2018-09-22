#!/usr/bin/python3
import json
import sys
import random

with open('combinedbatch.json','r') as f:
	data = json.load(f)
	values = {}
	j = int(sys.argv[2]) 
for i in data:
	try:
		editionISBN = i["editionISBN"].replace('"','').strip()
		if editionISBN not in values:
			values[editionISBN] = j
			j+=1
			editionID = values[editionISBN]	
	except:
		editionISBN = "unknown"
		editionID = j
		j+=1
	try:
		editionTitle = i["editionTitle"].replace('"','').strip()
	except:
		editionTitle = "unknown"
	try:
		editionDate = i["editionDate"].replace('"','').strip()
	except:
		editionDate = "unknown"

	print ("{}«{}«\"{}\"«{}".format(editionID,editionISBN,editionTitle,editionDate))

