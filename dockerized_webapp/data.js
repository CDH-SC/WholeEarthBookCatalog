/**
 * data.js
 * -----------------------------------------------------------------------------
 * import tool to pull from world cat into mongodb and neo4j
 */

/**
 * importing log utility
 * this may be modified later to log to database or file
 * there are 4 levels of logging, each includes all higher log items
 * 1: fatal (events causing complete failure)
 * 2: error (events causing loss of functionality, data, or uptime)
 * 3: info  (events useful for tracking execution)
 * 4: debug (events useful for tracking potential issues)
 */
var log = require('./utils/log');
log.level = 4;
log.debug("log level set to " + log.level);
log.info("preparing for import");

/**
 * importing mongodb driver
 */
log.debug("loading mongodb driver");
var mongodb = require('./utils/mongoDriver');
log.debug("mongodb driver loaded");

/**
 * importing neo4j driver
 */
log.debug("loading neo4j driver");
var neo4j = require('./utils/neo4jDriver');
log.debug("neo4j driver loaded");

/**
 * importing worldcat driver
 */
log.debug("loading worldcat driver");
var worldcat = require('./utils/worldCatDriver');
log.debug("worldcat driver loaded");

/**
 * importing exdefs
 */
log.debug("loading exdefs");
var exdefs = require('./utils/exdefs');
log.debug(exdefs);
exdefs[0].extractor();
log.debug("exdefs loaded");

log.info("beginning import");

log.info("import complete");