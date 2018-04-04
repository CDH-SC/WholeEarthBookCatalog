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
		title: b.title
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
			title: b.title
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
	LIMIT 100
`;

qstrings.advancedSearchPerson = `OPTIONAL MATCH
                                (p:Person)-[*..{ degrees }]-(e:Edition),
                                (p1:Person)-[:WROTE]->(e),
                                (x:Publisher)-[:PUBLISHED]->(e),
                                (x)-[:PUBLISHES_IN]->(y:Place)
                                WHERE
                                p.lname =~ { lname_re }
                                OR p.fname =~ { fname_re }
                                WITH 
                                {
                                    authors: collect( DISTINCT (p.fname + " " + p.lname)),
                                    publishers: collect( DISTINCT pub.name ),
                                    title: e.title
                                } as tmp
                                WITH
                                    collect( DISTINCT tmp ) as records

								UNWIND records as r
                                RETURN DISTINCT
                                CASE
                                WHEN (r.title IS NULL OR r.authors IS NULL OR r.publishers IS NULL) THEN NULL
                                ELSE r
                                END AS res
                                LIMIT 100`;

/* Edition
    - Edition
    - Published by
    - Written by
    - Published in
*/
qstrings.advancedSearchEdition = `OPTIONAL MATCH
                                    (e:Edition)<-[:PUBLISHED]-(pub:Publisher),
                                    (e)<-[:WROTE]-(a:Person)
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
                                    OR e.year =~ { year_re }
									WITH 
									{ 
                                        authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                        publishers: collect( DISTINCT pub.name),
                                        title: e.title 
                                    } as tmp
                                    WITH
                                        collect( DISTINCT tmp ) as records


                                    OPTIONAL MATCH
                                    (e:Edition)<-[:PUBLISHED]-(pub:Publisher),
                                    (pub)-[:PUBLISHED]->(e1:Edition),
                                    (e1)<-[:WROTE]-(a:Person)
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
                                    OR e.year =~ { year_re }
                                    WITH
                                    {
                                        data: {
                                            authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                            publishers: collect( DISTINCT pub.name ),
                                            title: e1.title
                                        }, records: records
                                    } as tmp
                                    WITH
                                        collect( DISTINCT tmp.data ) + tmp.records as records
									
										
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
                                    WITH
                                    {
                                        data: {
                                            authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                            publishers: collect( DISTINCT pub2.name ),
                                            title: e1.title
                                        }, records: records
                                    } as tmp
                                    WITH
                                        collect( DISTINCT tmp.data ) + tmp.records as records


                                    OPTIONAL MATCH
                                    (e:Edition)<-[:WROTE]-(a:Person),
                                    (a)-[:WROTE]->(e1:Edition),
                                    (e1)<-[:PUBLISHED]-(pub:Publisher),
									WHERE
									{ title_re } IN e.IBSN
									OR e.title =~ { title_re }
									OR e.year =~ { year_re }
                                    WITH
                                    {
                                        data: {
                                            authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                            publishers: collect( DISTINCT pub.name ),
                                            title: e1.title
                                        }, records: records
                                    } as tmp
                                    WITH
                                        collect( DISTINCT tmp.data ) + tmp.records as records

									UNWIND records as r
 									RETURN DISTINCT
                                    CASE
                                    WHEN (r.title IS NULL OR r.authors IS NULL OR r.publishers IS NULL) THEN NULL
                                    ELSE r
                                    END AS res
                                    LIMIT 100`;



// Place
qstrings.advancedSearchPlace = `OPTIONAL MATCH 
                                (p:Place)<-[:PUBLISHES_IN]-(pub:Publisher),
                                (pub)-[:PUBLISHED]->(e:Edition),
                                (e)<-[:WROTE]-(a:Person)
								WHERE
								p.name =~ { name_re }
                                WITH
                                {
                                    authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                    publishers: collect( DISTINCT pub.name),
                                    title: e.title
                                } as tmp
                                WITH
                                    collect( DISTINCT tmp ) as records

                                    
								UNWIND records as r
 								RETURN DISTINCT
                                CASE
                                WHEN (r.title IS NULL OR r.authors IS NULL OR r.publishers IS NULL) THEN NULL
                                ELSE r
                                END AS res
                                LIMIT 100`;


/* Publisher
    - Published
    - Publishes in
    - Writers
*/
qstrings.advancedSearchPublisher = `OPTIONAL MATCH 
                                    (p:Publisher)-[:PUBLISHED]->(e:Edition),
                                    (a:Person)-[:WROTE]->(e)
									WHERE
									p.name =~ { name_re }
                                    WITH
                                    {
                                        authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                        publishers: collect( DISTINCT p.name),
                                        title: e.title
                                    } as tmp
                                    WITH
                                    collect( DISTINCT tmp ) as records

                                    OPTIONAL MATCH 
                                    (p:Publisher)-[:PUBLISHES_IN]->(plc:Place),
                                    (p1:Publisher)-[:PUBLISHES_IN]->(plc),
                                    (e:Edition)<-[:PUBLISHED]-(p1),
                                    (a:Person)-[:WROTE]->(e)
									WHERE
									p.name =~ { name_re }
                                    WITH
                                    {
                                        data: {
                                            authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                            publishers: collect( DISTINCT p1.name ),
                                            title: e.title
                                        }, records: records
                                    } as tmp
                                    WITH
                                        collect( DISTINCT tmp.data ) + tmp.records as records

                                    OPTIONAL MATCH
                                    (p:Publisher)-[:PUBLISHED]->(e:Edition),
                                    (a:Person)-[:WROTE]->(e),
                                    (e1:Edition)<-[:WROTE]-(a),
                                    (p1:Publisher)-[:PUBLISHED]->(e1),
                                    (plc:Place)<-[:PUBLISHES_IN]-(p2)
                                    WHERE
                                    p.name =~ { name_re }
                                    WITH
                                    {
                                        data: {
                                            authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                            publishers: collect( DISTINCT p1.name ),
                                            title: e.title
                                        }, records: records
                                    } as tmp
                                    WITH
                                        collect( DISTINCT tmp.data ) + tmp.records as records
                                        

                                UNWIND records as r
 								RETURN DISTINCT
                                CASE
                                WHEN (r.title IS NULL OR r.authors IS NULL OR r.publishers IS NULL) THEN NULL
                                ELSE r
                                END AS res
                                LIMIT 100`;


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