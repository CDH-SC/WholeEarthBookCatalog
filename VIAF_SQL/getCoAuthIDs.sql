-- get author who has themself as a coauthor
select *
from coauthors_table, cluster_table
where coauthors_table.id=cluster_table.id and coAuth=name;

-- delete that coauthor entry
delete coauthors_table
from coauthors_table
inner join cluster_table on coAuth = name
where cluster_table.id = coauthors_table.id;

-- get coauthor id from person table
select *
from coauthors_table, cluster_table
where coAuth=name and not coauthors_table.id=cluster_table.id;

-- update coauthor id (id_2) with person id
update coauthors_table
left join cluster_table on coAuth=name
set coauthors_table.id_2 = person_table.id
where not coauthors_table.id=person_table.id;

-- update coauthor using alias table
update coauthors_table
left join aliases_table on coAuth=alias
set coauthors_table.id_2 = aliases_table.id
where not coauthors_table.id=aliases_table.id;

-- update coauthor using normnames table
update coauthors_table
left join normNames_table on coAuth=normName
set coauthors_table.id_2 = normNames_table.id
where not coauthors_table.id=normNames_table.id;
