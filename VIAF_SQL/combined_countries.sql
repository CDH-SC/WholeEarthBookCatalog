CREATE TABLE countries_temp 
	as(select id, country_id, country from countries_table);

TRUNCATE countries_table;

INSERT INTO countries_table(id, country_id, country)
	select id, st_country_id, country
    	from countries_temp, country_IDs
	where country = name;

DROP TABLE countries_temp;
