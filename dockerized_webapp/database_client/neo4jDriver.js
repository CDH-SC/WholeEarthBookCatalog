/*
 * Example script showing how to use the neo4j driver for node
 *
 */

"use strict";

var neo4j = require("neo4j-driver").v1
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD
var driver = neo4j.driver("bolt://neo4j", neo4j.auth.basic("neo4j", NEO4J_PASSWORD));

// verify session
exports.getSession = function() {
  const session = driver.session();
  return session;
}

driver.close();
