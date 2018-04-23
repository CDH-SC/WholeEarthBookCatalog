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
OPTIONAL MATCH (p:Person)-[:WROTE]->(b:Edition)<-[:PUBLISHED]-(pub:Publisher)-[:PUBLISHES_IN]->(plc:Place)
WHERE
  b.title =~ { regex } AND 
  NOT b.title IS NULL AND
  size((b)<-[:WROTE]-()) > 0 AND
  size((b)<-[:PUBLISHED]-()) > 0

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
} as record
RETURN DISTINCT record
LIMIT {limit}
`;


// Advanced Search Query Strings
qstrings.optionalMatch = `OPTIONAL MATCH `;

qstrings.relations = ' (p:Person)-[:WROTE]->(b:Edition)<-[:PUBLISHED]-(pub:Publisher)-[:PUBLISHES_IN]->(plc:Place) ';

qstrings.advancedAuthor = ' p.name =~ { name_re } ';

qstrings.advancedPublisher = ' pub.name =~ { name_re } ';

qstrings.advancedPlace = ' plc.name =~ { plcname_re } ';

qstrings.advancedEditionTitle = ' b.title =~ { title_re } ';

qstrings.advancedEditionISBN = ' OR { isbn_re } IN b.IBSN ';

qstrings.advancedEditionYear = ' OR b.year =~ { year_re } ';

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
