/*
 * Example script showing how to use the neo4j driver for node
 *
 */

"use strict";

// module
var neo4jDriver = {}

// env
var neo4j = require("neo4j-driver").v1
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD
const NEO4J_URL = process.env.NEO4J_URL

// get session
var getSession = function() {
    var driver = neo4j.driver(`bolt://${NEO4J_URL}`, neo4j.auth.basic("neo4j", NEO4J_PASSWORD));
    return driver.session();
}

// run commands
neo4jDriver.query = function(statement, params) {
    var driver = neo4j.driver(`bolt://${NEO4J_URL}`, neo4j.auth.basic("neo4j", NEO4J_PASSWORD));
    var session = driver.session();
    var result;

    var txRes = session.readTransaction(function (transaction) {
        // used transaction will be committed automatically, no need for explicit commit/rollback
        var res = transaction.run(statement, params);
	return res;
     })
     
     return { response: txRes, driver: driver, session: session };  
}

module.exports = neo4jDriver;
