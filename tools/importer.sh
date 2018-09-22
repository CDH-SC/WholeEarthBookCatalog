#!/bin/bash

if [ $# -eq 3 ];then
    neo4j-admin import --mode=csv --database "$1" --id-type string \ 
                        --nodes:person headers/person_header.csv,data/person_batch.csv \ 
                        --nodes:edition headers/edition_header.csv,data/edition_batch.csv \ 
                        --nodes:publisher headers/publisher_header.csv,data/publisher_batch.csv \ 
                        --nodes:place headers/place_header.csv,data/place_batch.csv \ 
                        --relationships:WROTE headers/wrote_rel_header.csv,data/wrote_rel_batch.csv \ 
                        --relationships:PUBLISHED headers/published_rel_header.csv,data/published_rel_batch.csv \ 
                        --relationships:PUBLISHED_IN headers/place_rel_header.csv,data/place_rel_batch.csv \ 
                        --relationships:PUBLISHED_IN headers/edition_rel_header.csv,data/edition_rel_batch.csv  \ 
                        --ignore-duplicate-nodes true --delimiter "$2" --high-io true --quote "$3"

else
    echo "Usage: ./importer.sh dbname delimter quotechar"
fi



