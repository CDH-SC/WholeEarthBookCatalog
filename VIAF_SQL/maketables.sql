CREATE TABLE full_table(
	id VARCHAR(30),
	type VARCHAR(30),
	names VARCHAR (2000),
	normNames VARCHAR (3000),
	coauthors VARCHAR (2000),
	publishers VARCHAR (2000),
	isbns VARCHAR (2000),
	countries VARCHAR (200),
	titles VARCHAR (8000),
	startDate VARCHAR(14),
	endDate VARCHAR(14),
	dateType VARCHAR(20),
	nationality VARCHAR(40)
);

CREATE TABLE cluster_table (
	id VARCHAR(30), 
	type VARCHAR(30),
	name VARCHAR(2000), 
	startDate VARCHAR(14), 
	endDate VARCHAR(14),
	dateType VARCHAR(20), 
	nationality VARCHAR(40),
	PRIMARY KEY(id, name)
);

CREATE TABLE aliases_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	alias VARCHAR(200),
	PRIMARY KEY(id, alias)
);

CREATE TABLE normNames_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	normName VARCHAR(200),
	PRIMARY KEY(id, normName) 
);

CREATE TABLE coauthors_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	id_2 VARCHAR(30),
	coAuth VARCHAR(200),
	PRIMARY KEY(id, coAuth)
);

CREATE TABLE publishers_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	pub_id VARCHAR(30),
	publisher VARCHAR(200),
	PRIMARY KEY(id, publisher) 
);

CREATE TABLE isbn_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	isbn VARCHAR(15),
	PRIMARY KEY(id, isbn) 
);

CREATE TABLE countries_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	country_id VARCHAR(30),
	country CHAR(2) 
);

CREATE TABLE titles_table (
	id VARCHAR(50) REFERENCES cluster_table(id), 
	title_id VARCHAR(30), 
	title VARCHAR(2000)
);

/*
CREATE TABLE country_IDs(
	st_country_id VARCHAR(3),
	type CHAR(5),
	name CHAR(2),
	name2 VARCHAR(100)
);*/

