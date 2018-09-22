#!/usr/bin/python3
import csv
import sys
import random

csv.field_size_limit(sys.maxsize)

with open('extracted/data/edition_batch.csv', 'r') as f:
	edition_data = csv.reader(f, delimiter='«')

	with open('extracted/data/place_batch.csv', 'r') as f:
		place_data = csv.reader(f, delimiter='«')

		for edition,place, in zip(edition_data,place_data):
			print ("{}«{}«PUBLISHED_IN".format(edition[0],place[0]))	
