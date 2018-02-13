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

    var txRes = session.readTransaction(function (transaction) {
        // used transaction will be committed automatically, no need for explicit commit/rollback

        var result = transaction.run(statement, params);
        // at this point it is possible to either return the result or process it and return the
        // result of processing it is also possible to run more statements in the same transaction
        return result;
    });

    console.log(`txRes: ${txRes}`);
    return txRes
    session.close()
    driver.close()

    /**
    session.run(statement, params)
        .then(function(res) {
            console.log(`Query: ${JSON.stringify(statement, null, 2)}\n${JSON.stringify(params, null, 2)}\nResponse: ${JSON.stringify(res, null, 2)}`);
            recordObj = res;
            driver.close();
            session.close();
        })
        .catch(function(err) {
            console.log(`ERR: ${JSON.stringify(err, null, 2)}`);
        })
    */
}

module.exports = neo4jDriver;
