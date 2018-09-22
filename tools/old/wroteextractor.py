#!/usr/bin/python3
import csv
import sys
import random

csv.field_size_limit(sys.maxsize)

with open('extracted/data/person_batch.csv', 'r') as f:
	person_data = csv.reader(f, delimiter='«')

	with open('extracted/data/edition_batch.csv', 'r') as f:
		edition_data = csv.reader(f, delimiter='«')

		for person,edition, in zip(person_data,edition_data):
			print ("{}«{}«WROTE".format(person[0],edition[0]))	
