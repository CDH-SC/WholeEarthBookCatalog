CREATE TABLE full_table(
	id VARCHAR(30),
	type VARCHAR(30),
	names VARCHAR (8000),
	normNames VARCHAR (8000),
	coauthors VARCHAR (8000),
	publishers VARCHAR (8000),
	isbns VARCHAR (4000),
	countries VARCHAR (1000),
	titles VARCHAR (20000),
	startDate VARCHAR(200),
	endDate VARCHAR(200),
	dateType VARCHAR(20),
	nationality VARCHAR(200)
);

CREATE TABLE cluster_table (
	id VARCHAR(30), 
	type VARCHAR(30),
	name VARCHAR(3000), 
	startDate VARCHAR(200), 
	endDate VARCHAR(200),
	dateType VARCHAR(20), 
	nationality VARCHAR(200),
	PRIMARY KEY(id, name)
);

CREATE TABLE aliases_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	alias VARCHAR(3000),
	PRIMARY KEY(id, alias)
);

CREATE TABLE normNames_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	normName VARCHAR(3000),
	PRIMARY KEY(id, normName) 
);

CREATE TABLE coauthors_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	id_2 VARCHAR(30),
	coAuth VARCHAR(3000),
	PRIMARY KEY(id, coAuth)
);

CREATE TABLE publishers_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	pub_id VARCHAR(30),
	publisher VARCHAR(3000),
	PRIMARY KEY(id, publisher) 
);

CREATE TABLE isbn_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	isbn VARCHAR(30),
	PRIMARY KEY(id, isbn) 
);

CREATE TABLE countries_table (
	id VARCHAR(30) REFERENCES cluster_table(id), 
	country_id VARCHAR(200),
	country CHAR(200) 
);

CREATE TABLE titles_table (
	id VARCHAR(50) REFERENCES cluster_table(id), 
	title_id VARCHAR(300), 
	title VARCHAR(60000)
);

/*
CREATE TABLE country_IDs(
	st_country_id VARCHAR(3),
	type CHAR(5),
	name CHAR(2),
	name2 VARCHAR(100)
);*/

