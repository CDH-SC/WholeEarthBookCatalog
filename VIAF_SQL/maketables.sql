CREATE TABLE person_table (
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
	id VARCHAR(30) REFERENCES person_table(id), 
	alias VARCHAR(200),
	PRIMARY KEY(id, alias)
);

CREATE TABLE normNames_table (
	id VARCHAR(30) REFERENCES person_table(id), 
	normName VARCHAR(200),
	PRIMARY KEY(id, normName) 
);

CREATE TABLE coauthors_table (
	id VARCHAR(30) REFERENCES person_table(id), 
	id_2 VARCHAR(30),
	coAuth VARCHAR(200)
);

CREATE TABLE publishers_table (
	id VARCHAR(30) REFERENCES person_table(id), 
	pub_id VARCHAR(30),
	publisher VARCHAR(200) 
);

CREATE TABLE isbn_table (
	id VARCHAR(30) REFERENCES person_table(id), 
	isbn VARCHAR(15),
	PRIMARY KEY(id, isbn) 
);

CREATE TABLE countries_table (
	id VARCHAR(30) REFERENCES person_table(id), 
	country_id VARCHAR(30),
	country CHAR(2) 
);

CREATE TABLE titles_table (
	id VARCHAR(50) REFERENCES person_table(id), 
	title_id VARCHAR(30), 
	title VARCHAR(2000)
);

CREATE TABLE country_IDs(
	st_country_id VARCHAR(3),
	type CHAR(5),
	name CHAR(2),
	name2 VARCHAR(100)
);

