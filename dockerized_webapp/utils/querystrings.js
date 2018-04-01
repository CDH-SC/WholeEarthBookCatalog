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

qstrings.keywordSearchExample = `OPTIONAL MATCH (p:Person)-[*..2]-(b:Edition)
						WHERE p.lname =~ { regex }
						OR p.fname =~ { regex }
						WITH collect(b) as c1

						OPTIONAL MATCH (e:Edition)-[*..2]-(b:Edition)
						WHERE e.title =~ { regex }
						WITH collect(e)+collect(b)+c1 as c2

						OPTIONAL MATCH (n:Publisher)-[:PUBLISHES_IN|:DIRECTED]->(c:Place)-[*..2]-(b:Edition)
						WHERE n.name =~ { regex }
						WITH collect(b)+c2 as c3

						UNWIND c3 as x
						RETURN DISTINCT x
						LIMIT { limit }`;

/*
 *
 *
*/
qstrings.keywordSearch = `OPTIONAL MATCH (e:Edition)-[:IS-A-VERSION-OF]->(e1:Edition)-[*..6]-(e2:Edition)
													WHERE
													{ regex } IN e.IBSN
													OR e.title =~ { regex }
													OR e.year =~ { regex }
													WITH collect(e)+collect(e1)+collect(e2) as c1

													OPTIONAL MATCH (p:Person)-[:WROTE|:EDITTED|:CONTRIBUTED-TO|:TRANSLATED]->(x:Edition)-[*..6]-(e:Edition)
													WHERE
													p.lname =~ { regex }
													OR p.fname =~ { regex }
													OR p.death =~ { regex }
													OR p.birth =~ { regex }
													WITH collect(c1)+collect(p)+collect(e)+collect(x) as c2

													OPTIONAL MATCH (p:Publisher)-[:PUBLISHER-IN]->(x:Place)-[*..6]-(e:Edition)
													WHERE
													p.name =~ { regex }
													WITH collect(c2)+collect(x)+collect(e) as c3

													OPTIONAL MATCH (p:Publisher)-[:PUBLISHED]->(e:Edition)-[*..6]-(e1:Edition)
													WHERE
													p.name =~ { regex }
													WITH collect(c3)+collect(x)+collect(e) as c4

													OPTIONAL MATCH (p:Place)<-[:PUBLISHED-IN]-(e:Edition)-[*..6]-(e1:Edition)
													WHERE
													p.name =~ { regex }
													WITH collect(c4)+collect(p)+collect(e)+collect(e1) as c5

													UNWIND c5 as x
													RETURN DISTINCT x
													LIMIT { limit }`;


qstrings.singleNode = `MATCH (s) WHERE ID(s) = { val } RETURN s`;
/**
 *
 *
 */
qstrings.advancedSearchPerson = `OPTIONAL MATCH
                                 (p:Person)-[:WROTE]->(x:Edition)-[*..{ degrees }]-(e:Edition)
                                 WHERE
                                 p.lname =~ { lname_re }
                                 OR p.fname =~ { fname_re }
                                 WITH collect(x)+collect(e)+collect(p) as c1

								 UNWIND c1 as x
								 RETURN DISTINCT x
                                 LIMIT { limit }`;

qstrings.advancedSearchEdition = `OPTIONAL MATCH
								    (e:Edition)<-[:PUBLISHED]-(p:Publisher)-[:PUBLISHED]->(e1:Edition)
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
									OR e.year =~ { year_re }
                                    WITH collect(e)+collect(e1)+collect(p) as c1
                                    
                                    OPTIONAL MATCH
                                    (e:Edition)-[*..{ degrees }]-(p:Place)-[*..{ degrees }]-(e1:Edition)
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
									OR e.year =~ { year_re }
                                    WITH collect(c1)+collect(e)+collect(e1)+collect(p) as c2

                                    OPTIONAL MATCH
								    (e:Edition)<-[:WROTE]-(p:Person)-[:WROTE]->(e1:Edition)
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
									OR e.year =~ { year_re }
                                    WITH collect(c2)+collect(e)+collect(e1)+collect(p) as c3

									UNWIND c3 as x
 									RETURN DISTINCT x
                                     LIMIT { limit }`;

qstrings.advancedSearchPlace = `OPTIONAL MATCH (p:Place)<-[*..{degrees}]-(x)-[*..2]->(y)
								WHERE
								p.name =~ { name_re }
								WITH collect(p)+collect(x)+collect(y) as c1

								UNWIND c1 as x
								RETURN DISTINCT x
								LIMIT { limit }`;

qstrings.advancedSearchPublisher = `OPTIONAL MATCH (p:Publisher)-[:PUBLISHED]->(e:Edition)-[*..{ degrees }]-(e1:Edition)
									WHERE
									p.name =~ { name_re }
									WITH collect(p)+collect(e)+collect(e1) as c1

									OPTIONAL MATCH (p:Publisher)-[:PUBLISHES_IN]->(x:Place)<-[:PUBLISHES_IN]-(p1:Publisher)-[:PUBLISHED*..{ degrees }]->(e1:Edition)
									WHERE
									p.name =~ { name_re }
                                    WITH collect(p)+collect(p1)+collect(x)+collect(e1)+collect(c1) as c2

									UNWIND c2 as x
									RETURN DISTINCT x
									LIMIT { limit }`;


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
	  
qstrings.createPublishesInRelation = `MERGE ({pubname})-[:PUBLISHES_IN]->({place})\n`;

// exports
module.exports = qstrings;
