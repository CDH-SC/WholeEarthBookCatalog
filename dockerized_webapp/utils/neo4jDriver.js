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
    var driver = neo4j.driver(`bolt://${NEO4J_URL}`);
    return driver.session();
}

// run commands
neo4jDriver.query = function(statement, params) {
    var driver = neo4j.driver(`bolt://${NEO4J_URL}`);
    var session = driver.session();
    var result;

    var txRes = session.readTransaction(function (transaction) {
        // used transaction will be committed automatically, no need for explicit commit/rollback
        var res = transaction.run(statement, params);
	    return res;
     })
     
     return { response: txRes, driver: driver, session: session };  
}

// Advanced Search
neo4jDriver.advancedQuery = function(data) {
    
    var pass = true;

    // Check types
    // Authors
    for ( var i = 0; i < data.authors.length; i++) {
        if ( !typeOf(data.authors[i].name) === "string" ) {
            pass = false;
        }
    }
    // Publishers
    for (var i = 0; i < data.publishers.length; i++) {
        if ( !typeOf(data.publishers[i].name) === "string" ) {
            pass = false;
        }
    }
    // Editions
    for ( var i = 0; i < data.editions.length; i++ ) {
        if ( !typeOf(data.editions[i].title) === "string" ) {
            pass = false;
        }
        if (!typeOf(data.editions[i].year) === "number") {
            pass = false;
        }
    }
    // Places
    for ( var i = 0; i < data.places.length; i++ ) {
        if ( !typeOf(data.places[i].name) === "string" ) {
            pass = false;
        }
    }
    
    if ( pass == true ) {
        var query = neo4jDriver.constructQuery(data);
        var session = driver.session();
        var result;

        var txRes = session.readTransaction(function (transaction) {
            var res = transaction.run(query);
            return res;
        })

        return { response: txRes, driver: driver, session: session };

    } else {
        var err = "Input must be a well-formed string";
        res.json({
            "Message": errstr,
            "Error": err
        });
        console.log(`neo4j request failed: ${err}\n`);
    }
}

// Construct Advanced Search Query
neo4jDriver.constructQuery = function(data) {

    var query = qstrings.optionalMatch;
    query += qstrings.relations;
    query += "WHERE";
    var before = false;

    // Authors
    if (data.author != null) {
        for (var i = 0; i < data.author.length; i++) {
            var addAuthor = qstrings.advancedAuthor;
            if (data.author[i].name != null) {
                addAuthor = addAuthor.replace('{ name_re }', '\"(?i).*' + data.author[i].name + '.*\"');
            }
            query += addAuthor;
            if (i + 1 < data.author.length) {
                query += "OR";
            }
        }
        before = true;
    }

    // Publishers
    if (data.publisher != null) {
        if (before == true) {
            query += "AND";
        }
        var addPublisher = qstrings.advancedPublisher;
        for (var i = 0; i < data.publisher.length; i++) {
            query += qstrings.advancedPublisher;
            addPublisher = addPublisher.replace('{ name_re }', '\"(?i).*' + data.publisher[i].name + '.*\"');
            query += addPublisher;
            if (i + 1 < data.publisher.length) {
                query += "OR";
            }
        }
        before = true;
    }

    // Book
    if (data.edition != null) {
        if (before == true) {
            query += "AND";
        }
        var addBook = qstrings.advancedEdition;
        for (var i = 0; i < data.edition.length; i++) {
            if (data.edition[i].title != null) {
                addBook = addBook.replace('{ title_re }', '\"(?i).*' + data.edition[i].title + '.*\"');
                addBook = addBook.replace('{ title_re }', '\"(?i).*' + data.edition[i].title + '.*\"');
            }
            if (data.edition[i].year != null) {
                addBook = addBook.replace('{ year_re }', '\"(?i).*' + data.edition[i].year + '.*\"');
            }
            query += addBook;
            if (i + 1 < data.edition.length) {
                query += "OR";
            }
        }
    }

    // Place
    if (data.place != null) {
        if (before == true) {
            query += "AND";
        }
        for (var i = 0; i < data.place.length; i++) {
            var addPlace = qstrings.advancedPlace;
            addPlace = addPlace.replace('{ plcname_re }', '\"(?i).*' + data.place[i].name + '.*\"');
            query += addPlace;
            if (i + 1 < data.place.length) {
                query += "OR";
            }
        }
    }


    query += qstrings.withCollectFirst;
    query += qstrings.unwindRecords;

    console.log(query + "\n\n");

    return query;
}

neo4jDriver.action = function(statement, params) {
    var driver = neo4j.driver(`bolt://${NEO4J_URL}`);
    var session = driver.session();
    return session
        .run(statement, params)
        .then(function (result) {
            session.close();
            driver.close();
        })
        .catch(function (error) {
            console.log(error);
            try {
                session.close();
                driver.close();
            } catch(ex) {

            }
        });
}

module.exports = neo4jDriver;
