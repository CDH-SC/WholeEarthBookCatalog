#!/bin/bash 
#for i in `seq 1 3`
i=0
#do 
	echo $i
	./pplextractor.py $i 0 >> extracted/data/person_batch.csv
	./editionextractor.py $i 0 >> extracted/data/edition_batch.csv
	./publishextractor.py $i 0 >> extracted/data/publisher_batch.csv
	./placeextractor.py $i 0 >> extracted/data/place_batch.csv
	./placerelextractor.py $i >> extracted/data/place_rel_batch.csv
	./publishedextractor.py $i >> extracted/data/published_rel_batch.csv
	./wroteextractor.py $i >> extracted/data/wrote_rel_batch.csv
	./editionrelextractor.py $i >> extracted/data/edition_rel_batch.csv
#done
