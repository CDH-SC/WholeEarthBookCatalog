/**
 * Preconstructed query strings for different types of neo4j queries
 */

"use strict";

// module
var qstrings = {};

/**
 * Params: 
 *   
 *   - keyword <string>
 *   - limit <number>
 *
 */    
qstrings.simpleKeywordSearch = `MATCH (n:Movie) 
	                        WHERE n.title CONTAINS { keyword } 
				RETURN DISTINCT n LIMIT { limit }`;

/**
 * Params:
 *
 *   - keyword <string>
 *   - limit <number>
 *
 */
qstrings.keywordSearch = `OPTIONAL MATCH (m:Movie)-[*..2]-(m1:Movie) 
	                  WHERE m.title CONTAINS { keyword }
                          WITH collect(m)+collect(m1) as c1

                          OPTIONAL MATCH (g:Genre)--(m2:Movie) 
	                  WHERE g.name CONTAINS { keyword }
                          WITH collect(m2)+c1 as c2

                          OPTIONAL MATCH (n:Person)-[:ACTED_IN|:DIRECTED]->(m3:Movie) 
	                  WHERE n.name CONTAINS { keyword }
                          WITH collect(m3)+c2 as c3

                          UNWIND c3 as x
                          RETURN DISTINCT x
                          LIMIT { limit }`;

// exports
module.exports = qstrings;
