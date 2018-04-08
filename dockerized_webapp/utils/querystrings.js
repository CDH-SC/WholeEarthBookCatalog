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
	p.lname =~ { regex } OR
	p.fname =~ { regex } OR
	plc.name =~ { regex } OR
	pub.name =~ { regex }
	
	WITH
	{
		authors: collect( DISTINCT (p.fname + " " + p.lname )), 
		publishers: collect( DISTINCT pub.name ),
		title: b.title,
		date: b.date
	} as tmp
        WITH
	collect( DISTINCT tmp ) as records
	
OPTIONAL  MATCH
    (:Edition)-[*..3]-(b:Edition),
    (p:Person)-[:WROTE]->(b)<-[:PUBLISHED]-(pub:Publisher)-[:PUBLISHES_IN]->(plc:Place)

	WHERE
	b.title =~ { regex } OR
	p.lname =~ { regex } OR
	p.fname =~ { regex } OR
	plc.name =~ { regex } OR
	pub.name =~ { regex }
	
	WITH
	{
		data: {
			authors: collect( DISTINCT (p.fname + " " + p.lname )), 
			publishers: collect( DISTINCT pub.name ),
			title: b.title,
			date: b.date
		},  records: records
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

qstrings.advancedAuthor = ' p.fname =~ { fname_re } OR p.lname =~ { lname_re } ';

qstrings.advancedPublisher = ' pub.name =~ { name_re } ';

qstrings.advancedPlace = ' plc.name =~ { plcname_re } ';

qstrings.advancedEdition = ' { title_re } IN b.IBSN OR b.title =~ { title_re } OR b.year =~ { year_re } ';

qstrings.withCollectFirst = `
                            WITH
                            {
                                authors: collect( DISTINCT (p.fname + " " + p.lname) ),
                                publishers: collect( DISTINCT pub.name),
                                title: b.title
                            } as tmp
                            WITH
                                collect( DISTINCT tmp ) as records
                                `;

qstrings.withCollect = `
                                    WITH
                                    {
                                        data: {
                                            authors: collect( DISTINCT (p.fname + " " + p.lname) ),
                                            publishers: collect( DISTINCT pub.name ),
                                            title: b.title
                                        }, records: records
                                    } as tmp
                                    WITH
                                        collect( DISTINCT tmp.data ) + tmp.records as records
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
