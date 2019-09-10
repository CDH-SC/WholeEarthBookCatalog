update countries_table 
left join country_IDs on country = name
set country_id = st_country_id
where country = name;
