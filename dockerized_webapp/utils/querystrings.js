/**
 * Preconstructed query strings for different types of neo4j queries
 */

"use strict";

// module
var qstrings = {};

/**
 * Params: 
 *   
 *   - regex <string>
 *   - limit <number>
 *
 */    
qstrings.simpleKeywordSearch = `MATCH (n:Movie) 
	                        WHERE n.title =~ { regex } 
				RETURN DISTINCT n LIMIT { limit }`;

/**
 * Params:
 *
 *   - regex <string>
 *   - limit <number>
 *
 */
qstrings.keywordSearch = `OPTIONAL MATCH (m:Movie)-[*..2]-(m1:Movie) 
	                  WHERE m.title =~ { regex }
                          WITH collect(m)+collect(m1) as c1

                          OPTIONAL MATCH (g:Genre)--(m2:Movie) 
	                  WHERE g.name =~ { regex }
                          WITH collect(m2)+c1 as c2

                          OPTIONAL MATCH (n:Person)-[:ACTED_IN|:DIRECTED]->(m3:Movie) 
	                  WHERE n.name =~ { regex }
                          WITH collect(m3)+c2 as c3

                          UNWIND c3 as x
                          RETURN DISTINCT x
                          LIMIT { limit }`;

/**
 * 
 * 
 */
qstrings.advancedSearchPerson = `OPTIONAL MATCH
                                 (p:Person)-[:WROTE|:EDITED|:CONTRIBUTED-TO|:TRANSLATED]->(x:Edition)-[*..{ degrees }]-(e:Edition)
                                 WHERE 
                                 p.lname =~ { lname_re } 
                                 OR p.fname =~ { fname_re } 
                                 OR p.death =~ { death_re } 
                                 OR p.birth =~ { birth_re }
                                 WITH collect(x)+collect(e) as c1`;

qstrings.getGraphJSON = `MATCH (p:Person)-[r]-(m:Movie) WHERE p.name CONTAINS "Tom"
                         WITH collect(r) as edges, collect(p)+collect(m) as nodes
                         RETURN nodes, edges`;

qstrings.createEdition = `MERGE (${title}:Edition { Title: ${title}, Date: ${date}, ISBN: ${isbn} })\n`;

qstrings.createPerson = `MERGE (${name}:Person { fname: ${fname}, lname: ${lname} })\n`;

qstrings.createPublisher = `MERGE (${pubname}:Publisher { name: ${pubname} })\n`;

qstrings.createPlace = `MERGE (${place}:Place { name: ${placename} })\n`;

qstrings.createWroteRelation = `MERGE (${name})-[:WROTE]->(${title})\n`;

qstrings.createPublishedRelation = `MERGE (${pubname})-[:PUBLISHED]->(${title})\n`;

qstrings.createPublishesInRelation = `MERGE (${pubname})-[:PUBLISHES-IN]->(${place})\n`;

// exports
module.exports = qstrings;
