#!/usr/bin/python3

import urllib
import urllib.request
import re
import os

source = "http://www.loc.gov/cds/products/MDSConnect-books_all.html"
pattern = "BooksAll\..{0,4}\.part.{0,2}\.xml\.gz"
requestFormat = "http://www.loc.gov/cds/downloads/MDSConnect/"
storageDir = "./LOCFiles/"

def getFile(url):
	print("Requesting: " + url)
	response = urllib.request.Request(url, headers={'User-Agent': "Magic Browser"})
	connection = urllib.request.urlopen(response)
	return connection.read()

def saveFile(directory, fileName, file):
	with open(directory + fileName, 'wb') as output:
		output.write(file)

page = str(getFile(source))
fileNames = re.findall(pattern, page)

if not os.path.exists(storageDir):
	os.makedirs(storageDir)

for fileName in fileNames:
	if not os.path.isfile(storageDir + fileName):
		fileUrl = requestFormat + fileName
		file = getFile(fileUrl)
		saveFile(storageDir, fileName, file)
