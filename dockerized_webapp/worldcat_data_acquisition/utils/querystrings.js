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
qstrings.keywordSearch = `OPTIONAL MATCH (e:Edition)-[:IS-A-VERSION-OF]->(e1:Edition)-[*..6]-(e2:Edition)
                                WHERE
                                { IBSN_re } IN e.IBSN
                                OR e.title =~ { title_re }
                                OR e.year =~ { year_re }
                                WITH collect(e)+collect(e1)+collect(e2) as c1

                                OPTIONAL MATCH (p:Person)-[:WROTE|:EDITTED|:CONTRIBUTED-TO|:TRANSLATED]->(x:Edition)-[*..6]-(e:Edition)
                                WHERE
                                p.lname =~ { lname_re }
                                OR p.fname =~ { fname_re }
                                OR p.death =~ { death_re }
                                OR p.birth =~ { birth_re }
                                WITH collect(c1)+collect(p)+collect(e)+collect(x) as c2

                                OPTIONAL MATCH (p:Publisher)-[:PUBLISHER-IN]->(x:Place)-[*..6]-(e:Edition)
                                WHERE
                                p.name =~ { name_re }
                                WITH collect(c2)+collect(x)+collect(e) as c3

                                OPTIONAL MATCH (p:Publisher)-[:PUBLISHED]->(e:Edition)-[*..6]-(e1:Edition)
                                WHERE
                                p.name =~ { name_re }
                                WITH collect(c3)+collect(x)+collect(e) as c4

                                OPTIONAL MATCH (p:Place)<-[:PUBLISHED-IN]-(e:Edition)-[*..6]-(e1:Edition)
                                WHERE
                                p.name =~ { name_re }
                                WITH collect(c4)+collect(p)+collect(e)+collect(e1) as c5

                                UNWIND c5 as x
                                RETURN DISTINCT x
                                LIMIT { limit }`;

/**
 * 
 * 
 */
qstrings.advancedSearchPerson = `OPTIONAL MATCH
                                 (p:Person)-[:WROTE|:EDITTED|:CONTRIBUTED-TO|:TRANSLATED]->(x:Edition)-[*..{ degrees }]-(e:Edition)
                                 WHERE 
                                 p.lname =~ { lname_re } 
                                 OR p.fname =~ { fname_re } 
                                 OR p.death =~ { death_re } 
                                 OR p.birth =~ { birth_re }
                                 WITH collect(x)+collect(e) as c1`;

qstrings.getGraphJSON = `MATCH (p:Person)-[r]-(m:Movie) WHERE p.name CONTAINS "Tom"
                         WITH collect(r) as edges, collect(p)+collect(m) as nodes
                         RETURN nodes, edges`;

qstrings.createEdition = `MERGE ({var_id}:Edition {
                                              title: "{Title}",
                                              date: {Date},
                                              isbn: {ISBN}
                                                  })`;

qstrings.createPerson = `MERGE ({var_id}:Person {
                                                fname: "{fname}",
                                                lname: "{lname}"
                                                        })`;

qstrings.createPlace = `MERGE ({var_id}:Place {
                                             name: "{placename}"
                                                        })`

qstrings.createPublisher = `MERGE ({var_id}:Publisher {
                                             name: "{pubname}"
                                                      })`
        
qstrings.createWroteRelation = `MERGE ({author})-[:WROTE]->({book})`;
        
qstrings.createPublishedRelation = `MERGE ({pubname})-[:PUBLISHED]->({book})`;
        
qstrings.createPublishesInRelation = `MERGE ({pubname})-[:PUBLISHES_IN]->({place})\n`

// exports
module.exports = qstrings;
