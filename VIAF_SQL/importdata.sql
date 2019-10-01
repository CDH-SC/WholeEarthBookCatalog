LOAD DATA LOCAL INFILE 'viaf-full.tsv' INTO TABLE full_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'viaf-full-split/personTable.tsv' INTO TABLE cluster_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'viaf-full-split/aliasesTable.tsv' INTO TABLE aliases_table IGNORE 1 ROWS;
/*show warnings;*/

LOAD DATA LOCAL INFILE 'viaf-full-split/coAuthorTable.tsv' INTO TABLE coauthors_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'viaf-full-split/countriesTable.tsv' INTO TABLE countries_table IGNORE 1 ROWS;
show warnings;

/* LOAD DATA LOCAL INFILE 'tables/countryIDs.tsv' INTO TABLE country_IDs IGNORE 1 ROWS;
show warnings;*/

LOAD DATA LOCAL INFILE 'viaf-full-split/normNamesTable.tsv' INTO TABLE normNames_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'viaf-full-split/isbnsTable.tsv' INTO TABLE isbn_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'viaf-full-split/pubTable.tsv' INTO TABLE publishers_table IGNORE 1 ROWS;
show warnings;

LOAD DATA LOCAL INFILE 'viaf-full-split/titlesTable.tsv' INTO TABLE titles_table IGNORE 1 ROWS;
show warnings;
