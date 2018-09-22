#!/usr/bin/python3
import csv
import sys
import random

csv.field_size_limit(sys.maxsize)

with open('extracted/data/publisher_batch.csv', 'r') as f:
	publisher_data= csv.reader(f, delimiter='«')

	with open('extracted/data/edition_batch.csv', 'r') as f:
		edition_data = csv.reader(f, delimiter='«')

		for publisher,edition, in zip(publisher_data,edition_data):
			print ("{}«{}«PUBLISHED".format(publisher[0],edition[0]))	
