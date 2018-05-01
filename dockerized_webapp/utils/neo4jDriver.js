/*
 * Example script showing how to use the neo4j driver for node
 *
 */

"use strict";

// module
var neo4jDriver = {}

var qstrings = require("./querystrings.js");

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

    /*
    // Check types
    // Authors
    for ( var i = 0; i < data.authors.length; i++) {
        if ( !typeof(data.authors[i].name) === "string" ) {
            pass = false;
        }
    }
    // Publishers
    for (var i = 0; i < data.publishers.length; i++) {
        if ( !typeof(data.publishers[i].name) === "string" ) {
            pass = false;
        }
    }
    // Editions
    for ( var i = 0; i < data.editions.length; i++ ) {
        if ( !typeof(data.editions[i].title) === "string" ) {
            pass = false;
        }
        if (!typeof(data.editions[i].year) === "string") {
            pass = false;
        }
    }
    // Places
    for ( var i = 0; i < data.places.length; i++ ) {
        if ( !typeof(data.places[i].name) === "string" ) {
            pass = false;
        }
    }
    */
     
    if ( pass == true ) {
        var driver = neo4j.driver(`bolt://${NEO4J_URL}`);
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
    query += qstrings.filter;
    var before = false;

    // Authors
    if (data.authors.length > 0) {
        for (var i = 0; i < data.authors.length; i++) {
            var addAuthor = qstrings.advancedAuthor;
            if (data.authors[i].name != null) {
                addAuthor = addAuthor.replace('{ name_re }', '\"(?i).*' + data.authors[i].name + '.*\"');
            }
            query += addAuthor;
            if (i + 1 < data.authors.length) {
                query += "OR";
            }
        }
        before = true;
    }

    // Publishers
    if (data.publishers.length > 0) {
        if (before == true) {
            query += "AND";
        }
        for (var i = 0; i < data.publishers.length; i++) {
            var addPublisher = qstrings.advancedPublisher;
            addPublisher = addPublisher.replace('{ name_re }', '\"(?i).*' + data.publishers[i].name + '.*\"');
            query += addPublisher;
            if (i + 1 < data.publishers.length) {
                query += "OR";
            }
        }
        before = true;
    }

    // Book
    if (data.editions.length > 0) {
        if (before == true) {
            query += "AND";
        }
        
        for (var i = 0; i < data.editions.length; i++) {
            var addBook = "";
            var yes = false;
            if (data.editions[i].title != null) {
                var addbookTitle = qstrings.advancedEditionTitle;
                addbookTitle = addbookTitle.replace('{ title_re }', '\".*' + data.editions[i].title + '.*\"');
                addBook += addbookTitle;
                yes = true;
            }

            if (data.editions[i].isbn != null) {
                var addbookISBN = "";
                if (yes == true) {
                    addbookISBN += " OR ";
                }
                addbookISBN += qstrings.advancedEditionISBN;
                addbookISBN = addbookISBN.replace('{ isbn_re }', '\"(?i).*' + data.editions[i].isbn + '.*\"')
                addBook += addbookISBN;
                yes = true;
            }
            if (data.editions[i].date != null) {
                var addbookYear = "";
                if ( yes == true ) {
                    addbookYear += " OR ";
                }
                addbookYear += qstrings.advancedEditionYear;
                addbookYear = addbookYear.replace('{ date_re }', '\".*' + data.editions[i].date + '.*\"');
                addBook += addbookYear;
            }
            query += addBook;
            if (i + 1 < data.editions.length) {
                query += "OR";
            }
        }
        before = true;
    }

    // Place
    if (data.places.length > 0) {
        if (before == true) {
            query += "AND";
        }
        for (var i = 0; i < data.places.length; i++) {
            var addPlace = qstrings.advancedPlace;
            addPlace = addPlace.replace('{ plcname_re }', '\"(?i).*' + data.places[i].name + '.*\"');
            query += addPlace;
            if (i + 1 < data.places.length) {
                query += "OR";
            }
        }
    }


    query += qstrings.withCollectFirst;
    // query += qstrings.unwindRecords;

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
