# Tools

These are tools used to import data into a Neo4j database. This is the preferred method for data importation

## locextractor.py
This tool is used to parse data from the batch files created by step1.js in the loc_data_miner container.
Usage instructions can be found by running ./locextractor.py --help 

## importer.sh
This file contains all the necessary flags needed to use the neo4j-admin import tool to import data extracted with locextractor.py 
into the Neo4j database. 
Usage instructions can be found by running ./importer.sh

## pdtools
Tools to transform extracted data into Pandas Dataframes. To load whole dataset into a dataframe, run python -i load_all.py to get an interactive shell or from load_all import * to import it into your code
