var log = new (require("./utils/log"))(4);

log.info("preparing for import");

// make mongodb connector
log.debug("load mongo driver");
var mongodb = require('../../database_client/mongoDriver');

// make neo4j connector
log.debug("load neo4j driver");
var neo4j = require('../../database_client/neo4jDriver');

// make world cat connector


log.info("beginning import");
// import

log.info("import complete");