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
		place = i["place"].replace('"','')
#		place = place.replace(",","\",\"")
#		place = place.replace("\\","") 
#		place = place.replace("\/","")
		if  place not in values:
			values[place] = j
			j+= 1

		placeID = values[place]	

	except:
		place = "unknown"
		placeID = j
		j+= 1

	print ("{}«\"{}\"".format(placeID,place))

