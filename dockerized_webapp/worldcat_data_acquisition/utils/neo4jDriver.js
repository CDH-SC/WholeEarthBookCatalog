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
    var session = getSession();
    var result;

    var txRes = session.readTransaction(function (transaction) {
        // used transaction will be committed automatically, no need for explicit commit/rollback

        transaction.run(statement, params)
		.then(function(res) {
                    result = res;
		})
	        .catch(function(err) {
		    result = err;
		})
        return result;
    });
    session.close()
    driver.close()
    return txRes
}

module.exports = neo4jDriver;
