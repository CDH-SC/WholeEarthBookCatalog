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



/** Person
 *
 */
qstrings.advancedSearchPerson = `OPTIONAL MATCH
                                (p:Person)-[*..{ degrees }]-(e:Edition),
                                (p1:Person)-[:WROTE]->(e),
                                (x:Publisher)-[:PUBLISHED]->(e),
                                (x)-[:PUBLISHES_IN]->(y:Place)
                                WHERE
                                p.lname =~ { lname_re }
                                OR p.fname =~ { fname_re }
                                WITH collect( { title: e.title, name: p1.fname + " " + p1.lname, publisher: x.name, place: y.name } ) as c1

								 UNWIND c1 as x
								 RETURN DISTINCT x
                                 LIMIT { limit }`;

/* Edition
    - Edition
    - Published by
    - Written by
    - Published in
*/
qstrings.advancedSearchEdition = `OPTIONAL MATCH
                                    (e:Edition)<-[:PUBLISHED]-(pub:Publisher),
                                    (e)<-[:WROTE]-(a:Person),
                                    (pub)-[:PUBLISHES_IN]->(plc:Place)
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
									OR e.year =~ { year_re }
                                    WITH collect( { title: e.title, name: a.fname + " " + a.lname, publisher: pub.name, place: plc.name } ) as c1

                                    OPTIONAL MATCH
                                    (e:Edition)<-[:PUBLISHED]-(pub:Publisher),
                                    (pub)-[:PUBLISHED]->(e1:Edition),
                                    (e1)<-[:WROTE]-(a:Person),
                                    (pub)-[:PUBLISHES_IN]->(plc:Place)
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
									OR e.year =~ { year_re }
                                    WITH collect(c1)
                                    +collect( { title: e1.title, name: a.fname + " " + a.lname, publisher: pub.name, place: plc.name } ) as c2
                                    
                                    OPTIONAL MATCH
                                    (e:Edition)<-[:PUBLISHED]-(pub:Publisher),
                                    (pub)-[:PUBLISHES_IN]->(plc:Place),
                                    (plc)<-[:PUBLISHES_IN]-(pub2:Publisher),
                                    (pub2)-[:PUBLISHED]->(e1:Edition),
                                    (e1)<-[:WROTE]-(a:Person)
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
									OR e.year =~ { year_re }
                                    WITH collect(c2)
                                    +collect( { title: e1.title, name: a.fname + " " + a.lname, publisher: pub2.name, place: plc.name } ) as c3

                                    OPTIONAL MATCH
                                    (e:Edition)<-[:WROTE]-(a:Person),
                                    (a)-[:WROTE]->(e1:Edition),
                                    (e1)<-[:PUBLISHED]-(pub:Publisher),
                                    (pub)-[:PUBLISHES_IN]->(plc:Place),
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
									OR e.year =~ { year_re }
                                    WITH collect(c3)
                                    +collect( { title: e1.title, name: a.fname + " " + a.lname, publisher: pub.name, place: plc.name } ) as c4


									UNWIND c4 as x
 									RETURN DISTINCT x
                                    LIMIT { limit }`;



// Place
qstrings.advancedSearchPlace = `OPTIONAL MATCH 
                                (p:Place)<-[:PUBLISHES_IN]-(pub:Publisher),
                                (pub)-[:PUBLISHED]->(e:Edition),
                                (e)<-[:WROTE]-(a:Person)
								WHERE
								p.name =~ { name_re }
								WITH collect( { title: e.title, name: a.fname + " " + a.lname, publisher: pub.name, place: p.name } ) as c1

								UNWIND c1 as x
								RETURN DISTINCT x
                                LIMIT { limit }`;


/* Publisher
    - Published
    - Publishes in
    - Writers
*/
qstrings.advancedSearchPublisher = `OPTIONAL MATCH 
                                    (p:Publisher)-[:PUBLISHED]->(e:Edition),
                                    (plc:Place)<-[:PUBLISHES_IN]-(p),
                                    (a:Person)-[:WROTE]->(e)
									WHERE
									p.name =~ { name_re }
									WITH collect( { title: e.title, name: a.fname + " " + a.lname, publisher: p.name, place: plc.name } ) as c1

                                    OPTIONAL MATCH 
                                    (p:Publisher)-[:PUBLISHES_IN]->(plc:Place),
                                    (p1:Publisher)-[:PUBLISHES_IN]->(plc),
                                    (e:Edition)<-[:PUBLISHED]-(p1),
                                    (a:Person)-[:WROTE]->(e)
									WHERE
									p.name =~ { name_re }
                                    WITH collect(c1)+
                                    collect( { title: e.title, name: a.fname + " " + a.lname, publisher: p1.name, place: plc.name } ) as c2

                                    OPTIONAL MATCH
                                    (p:Publisher)-[:PUBLISHED]->(e:Edition),
                                    (a:Person)-[:WROTE]->(e),
                                    (e1:Edition)<-[:WROTE]-(a),
                                    (p1:Publisher)-[:PUBLISHED]->(e1),
                                    (plc:Place)<-[:PUBLISHES_IN]-(p2)
                                    WHERE
                                    p.name =~ { name_re }
                                    WITH collect(c2)+
                                    collect( { title: e1.title, name: a.fname + " " + a.lname, publisher: p1.name, place: plc.name } ) as c3

                                    UNWIND c3 as x
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
