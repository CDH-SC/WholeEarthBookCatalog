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
qstrings.keywordSearch = `
OPTIONAL MATCH

	(p:Person)-[:WROTE]->(b:Edition)<-[:PUBLISHED]-(pub:Publisher)-[:PUBLISHES_IN]->(plc:Place)

	WHERE
	b.title =~ { regex } OR
	p.name =~ { regex } OR
	plc.name =~ { regex } OR
	pub.name =~ { regex }
	
	WITH
	{
		title: b.title,
		isbn: b.isbn,
		date: toString( b.date ),
		id: toString( id(b) ),
		authors: collect(
		DISTINCT {
			name: p.name,
			id: toString( id(p) ) 
		}), 
		publishers: collect(
		DISTINCT {
			name: pub.name,
			id: toString( id(pub) )
		}),
		places: collect(
		DISTINCT {
			name: plc.name,
			id: toString( id(plc) )
		}),
		relationships: {
            wrote: collect(
			DISTINCT [
				toString( id(p) ),
				toString( id(b) )
			]),
			published: collect(
			DISTINCT [
				toString( id(pub) ),
				toString( id(b) )
			]),
			publishes_in: collect(
			DISTINCT [
				toString( id(pub) ),
				toString( id(plc) )
			])
		}
	} as tmp

    WITH
	collect( DISTINCT tmp ) as records
	
OPTIONAL  MATCH
    (b1:Edition)-[*..2]-(b:Edition),
    (p:Person)-[:WROTE]->(b)<-[:PUBLISHED]-(pub:Publisher)-[:PUBLISHES_IN]->(plc:Place),
	(p1:Person)-[:WROTE]->(b1)<-[:PUBLISHED]-(pub1:Publisher)-[:PUBLISHES_IN]->(plc1:Place)
	
	WHERE
	b.title =~ { regex } OR
	p.name =~ { regex } OR
	plc.name =~ { regex } OR
	pub.name =~ { regex }
	
	WITH
	{
		data: {
			title: b1.title,
			isbn: b1.isbn,
			date: toString( b1.date ),
			id: toString( id(b1) ),
			authors: collect(
			DISTINCT {
				name: p1.name,
				id: toString( id(p1) ) 
			}), 
			publishers: collect(
			DISTINCT {
				name: pub1.name,
				id: toString( id(pub1) )
			}),
			places: collect(
			DISTINCT {
				name: plc1.name,
				id: toString( id(plc1) )
			}),
			relationships: {
				wrote: collect(
				DISTINCT [
					toString( id(p1) ),
					toString( id(b1) )
				]),
				published: collect(
				DISTINCT [
					toString( id(pub1) ),
					toString( id(b1) )
				]),
				publishes_in: collect(
				DISTINCT [
					toString( id(pub1) ),
					toString( id(plc1) )
				])
			}
		},
		records: records
	} as tmp

    WITH
	collect( DISTINCT tmp.data ) + tmp.records as records

	UNWIND records as r
	RETURN DISTINCT
	    CASE
			WHEN (r.title IS NULL OR r.authors IS NULL OR r.publishers IS NULL) THEN NULL
			ELSE r
		END AS res
	LIMIT { limit }
`;


// Advanced Search Query Strings
qstrings.optionalMatch = `OPTIONAL MATCH `;

qstrings.relations = ' (p:Person)-[:WROTE]->(b:Edition)<-[:PUBLISHED]-(pub:Publisher)-[:PUBLISHES_IN]->(plc:Place) ';

qstrings.advancedAuthor = ' p.name =~ { name_re } ';

qstrings.advancedPublisher = ' pub.name =~ { name_re } ';

qstrings.advancedPlace = ' plc.name =~ { plcname_re } ';

qstrings.advancedEdition = ' { title_re } IN b.IBSN OR b.title =~ { title_re } OR b.year =~ { year_re } ';

qstrings.withCollectFirst = `
                                    WITH
                                    {
                                            title: b.title,
                                            isbn: b.isbn,
                                            date: toString( b.date ),
                                            id: toString( id(b) ),
                                            authors: collect(
                                                DISTINCT {
                                                    name: p.name,
                                                    id: toString( id(p) )
                                                }
                                            ),
                                            publishers: collect(
                                                DISTINCT {
                                                    name: pub.name,
                                                    id: toString( id(pub) )
                                                }
                                            ),
                                            places: collect(
                                                DISTINCT {
                                                    name: plc.name,
                                                    id: toString( id(plc) )
                                                }
                                            ),
                                            relationships: {
                                                wrote: collect(
                                                    DISTINCT [
                                                        toString( id(p) ),
                                                        toString( id(b) )
                                                    ]
                                                ),
                                                published: collect(
                                                    DISTINCT [
                                                        toString( id(pub) ),
                                                        toString( id(b) )
                                                    ]
                                                ),
                                                publishes_in: collect(
                                                    DISTINCT [
                                                        toString( id(pub) ),
                                                        toString( id(plc) )
                                                    ]
                                                )
                                            }
                                    } as tmp
                                    WITH
                                        collect( DISTINCT tmp ) as records
                                        `;

qstrings.unwindRecords = `
                            UNWIND records as r
 							RETURN DISTINCT
                            CASE
                            WHEN (r.title IS NULL OR r.authors IS NULL OR r.publishers IS NULL) THEN NULL
                            ELSE r
                            END AS res
                            LIMIT 100
                            `;

qstrings.getGraphJSON = `MATCH (p:Person)-[r]-(m:Movie) WHERE p.name CONTAINS "Tom"
                         				WITH collect(r) as edges, collect(p)+collect(m) as nodes
                         				RETURN nodes, edges`;

qstrings.singleNode = `MATCH (s) WHERE ID(s) = { id } RETURN s`;


qstrings.createEdition = `
MERGE ({var_id}:Edition {
	title: "{Title}",
	date: {Date},
	isbn: {ISBN}
})`;

qstrings.createPerson = `
MERGE ({var_id}:Person {
	name: "{name}"
})`;

qstrings.createPlace = `
MERGE ({var_id}:Place {
	name: "{placename}"
})
`;

qstrings.createPublisher = `
MERGE ({var_id}:Publisher {
	name: "{pubname}"
})
`;
	  
qstrings.createWroteRelation = `
MERGE ({author})-[:WROTE]->({book})
`;
	  
qstrings.createPublishedRelation = `
MERGE ({pubname})-[:PUBLISHED]->({book})
`;
	  
qstrings.createPublishesInRelation = `
MERGE ({pubname})-[:PUBLISHES_IN]->({place})
`;

module.exports = qstrings;