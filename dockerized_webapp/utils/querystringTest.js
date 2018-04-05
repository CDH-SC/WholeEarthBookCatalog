var qstringsTest = {};

qstringsTest.optionalMatch = `OPTIONAL MATCH `;

qstringsTest.relations = ' (p:Person)-[:WROTE]->(b:Edition)<-[:PUBLISHED]-(pub:Publisher)-[:PUBLISHES_IN]->(plc:Place) ';

qstringsTest.advancedAuthor = ' p.fname =~ { fname_re } OR p.lname =~ { lname_re } ';

qstringsTest.advancedPublisher = ' pub.name =~ { name_re } ';

qstringsTest.advancedPlace = ' plc.name =~ { plcname_re } ';

qstringsTest.advancedEdition = ' { title_re } IN b.IBSN OR b.title =~ { title_re } OR b.year =~ { year_re } ';

qstringsTest.withCollectFirst = `
                            WITH
                            {
                                authors: collect( DISTINCT (a.fname + " " + a.lname) ),
                                publishers: collect( DISTINCT p.name),
                                title: e.title
                            } as tmp
                            WITH
                                collect( DISTINCT tmp ) as records
                                `;

qstringsTest.withCollect = `
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
                                        `;

qstringsTest.unwindRecords = `
                            UNWIND records as r
 							RETURN DISTINCT
                            CASE
                            WHEN (r.title IS NULL OR r.authors IS NULL OR r.publishers IS NULL) THEN NULL
                            ELSE r
                            END AS res
                            LIMIT 100
                            `;
                            


module.exports = qstringsTest;