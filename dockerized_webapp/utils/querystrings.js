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

qstrings.keywordSearchExample = `OPTIONAL MATCH (m:Movie)-[*..2]-(m1:Movie)
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

/*
 *
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
                                 (p:Person)-[:WROTE|:EDITED|:CONTRIBUTED-TO|:TRANSLATED]->(x:Edition)-[*..{ degrees }]-(e:Edition)
                                 WHERE
                                 p.lname =~ { lname_re }
                                 OR p.fname =~ { fname_re }
                                 OR p.death =~ { death_re }
                                 OR p.birth =~ { birth_re }
                                 WITH collect(x)+collect(e) as c1

																 UNWIND c1 as x
																 RETURN DISTINCT x
																 LIMIT { limit }`;

qstrings.advancedSearchEdition = `OPTIONAL MATCH
																	(e:Edition)-[:IS-A-VERSION-OF|:PUBLISHED-IN]->(x:Edition)-[*..{ degrees }]-(e1:Edition)
																	WHERE
																	{ IBSN_re } IN e.IBSN
																	OR e.title =~ { title_re }
																	OR e.year =~ { year_re }
																	WITH collect(x)+collect(e1) as c1

																	UNWIND c1 as x
 																  RETURN DISTINCT x
 																  LIMIT { limit }`;

qstring.advancedSearchPlace = `OPTIONAL MATCH (p:Place)<-[*..{ degrees }]-(x)
															 WHERE
															 p.name =~ { name_re }
															 WITH collect(p)+collect(x) as c1

															 UNWIND c1 as x
															 RETURN DISTINCT x
															 LIMIT { limit }`;

qstring.advancedSearchPublisher = `OPTIONAL MATCH (p:Publisher)-[:PUBLISHED]->(e:Edition)-[*..{ degrees }]-(e1:Edition)
																	 WHERE
																	 p.name =~ { name_re }
																	 WITH collect(p)+collect(e)+collect(e1) as c1

																	 OPTIONAL MATCH (p:Publisher)-[:PUBLISHER-IN]->(x:Place)-[*..{ degrees }]-(e1:Edition)
																	 WHERE
																	 p.name =~ { name_re }
																	 WITH collect(p)+collect(x)+collect(e1)+collect(c1) as c2

																	 UNWIND c2 as x
																	 RETURN DISTINCT x
																	 LIMIT { limit }`;


qstrings.getGraphJSON = `MATCH (p:Person)-[r]-(m:Movie) WHERE p.name CONTAINS "Tom"
                         				WITH collect(r) as edges, collect(p)+collect(m) as nodes
                         				RETURN nodes, edges`;


/**
qstrings.createEdition = `MERGE (${title}:Edition { Title: ${title}, Date: ${date}, ISBN: ${isbn} })\n`;

qstrings.createPerson = `MERGE (${name}:Person { fname: ${fname}, lname: ${lname} })\n`;

qstrings.createPublisher = `MERGE (${pubname}:Publisher { name: ${pubname} })\n`;

qstrings.createPlace = `MERGE (${place}:Place { name: ${placename} })\n`;

qstrings.createWroteRelation = `MERGE (${name})-[:WROTE]->(${title})\n`;

qstrings.createPublishedRelation = `MERGE (${pubname})-[:PUBLISHED]->(${title})\n`;

qstrings.createPublishesInRelation = `MERGE (${pubname})-[:PUBLISHES-IN]->(${place})\n`;
*/

// exports
module.exports = qstrings;
