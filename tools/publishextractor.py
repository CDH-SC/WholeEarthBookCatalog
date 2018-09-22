#!/usr/bin/python3
import json
import sys
import random

with open('combinedbatch.json', 'r') as f:
	data = json.load(f)

values = {}
j = int(sys.argv[2]) 
for i in data:
	try:
		publisher = i["publisher"].replace("\"","").strip()
#		publisher = publisher.replace("\\","") 
#		publisher = publisher.replace("\/","")
		if publisher not in values:
			values[publisher] = j
			j += 1

		publisherID = values[publisher]	

	except:
		publisher = "unknown"
		publisherID = j
		j += 1

	print ("{}«\"{}\"".format(publisherID,publisher))

