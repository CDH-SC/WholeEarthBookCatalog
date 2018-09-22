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
		person = i["person"].replace("\"","").strip()
#		person = person.replace("\"","\"\"")
#		person = person.replace("\\","") 
#		person = person.replace("\/","")
		if person not in values:
			values[person] = j
			j+= 1

		personID = values[person]

	except:
		person = "unknown"
		personID = j
		j+= 1

	print ("{}«\"{}\"".format(personID,person))

