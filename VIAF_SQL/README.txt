VIAF_SQL
----vasco madrid

This directory contains sql files and tsv files to start mysql viaf database
> NOTE: you must have mysql version 8 installed


create and restart database:
>run:
 	source createDB.sql 
to create the database, create tables, import data, and add IDs to countries

>run: 
	source restart.sql
to delete and recreate the databases (calls createDB.sql)


tables:
the tsv files in the tables directory are created from a larger TSV file that has 100 people (every 1000th line in viaf xml)
(these tables still need to be created for the complete data set)
