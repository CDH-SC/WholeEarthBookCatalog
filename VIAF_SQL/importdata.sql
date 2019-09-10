LOAD DATA LOCAL INFILE 'tables/small_viaf.tsv' INTO TABLE full_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'tables/personTable.tsv' INTO TABLE cluster_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'tables/aliasesTable.tsv' INTO TABLE aliases_table IGNORE 1 ROWS;
/*show warnings;*/

LOAD DATA LOCAL INFILE 'tables/coAuthorTable.tsv' INTO TABLE coauthors_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'tables/countriesTable.tsv' INTO TABLE countries_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'tables/countryIDs.tsv' INTO TABLE country_IDs IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'tables/normNamesTable.tsv' INTO TABLE normNames_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'tables/isbnsTable.tsv' INTO TABLE isbn_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'tables/pubTable.tsv' INTO TABLE publishers_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'tables/titlesTable.tsv' INTO TABLE titles_table IGNORE 1 ROWS;
show warnings;
