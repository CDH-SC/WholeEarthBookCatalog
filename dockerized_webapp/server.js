 /**
 *
 * An express server to serve as an API for the web app
 *
 */

"use strict";

var path = require("path");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongo = require("./utils/mongoDriver.js");
var port = process.env.PORT || 8080;
var router = express.Router();
var neo4j = require("./utils/neo4jDriver.js");
var utils = require("./utils");
var qstrings = require("./utils/querystrings.js");
var ObjectId = require("mongodb").ObjectId;

// add user
router.post("/add_user/", function (req, res) {
    var data = req.body;
    console.log(data);

    if (data.username === undefined || data.password === undefined) {
        var err = { "Error": "invalid data format. Users must have both a username and password" };
        console.log(err);
        res.json(err);
    } else {

        // construct userdoc
        var userdoc = {
            username: data.username
        };

        // check for existing user
        mongo.findDocument(userdoc, function (resp) {
            if (resp.length > 0) {
                var err = { "Error": "This username already exists" };
                console.log(err);
                res.json(err);
            } else {
                // encrypt password
                utils.hashPassword(data.password, 5, function (hashed) {
                    userdoc.password = hashed;
                    //userdoc.recent =
                    mongo.insertDocument(userdoc, function (resp) {
                        console.log(`JSON.stringify(resp, null, 2)`);
                        res.json(resp);
                    });
                });
            }
        });
    }
});

// get user
router.post("/get_user/", function (req, res) {
    var data = req.body;
    if (data.username === undefined || data.password === undefined) {
        var err = { "Error": "invalid data format" };
        console.log(err);
        res.json(err);
    } else {

        // construct query doc
        var userdoc = {
            username: data.username
        };

        mongo.findDocument(userdoc, function (resp) {
            if (resp.length > 0) {
                utils.hashPassword(data.password, 5, function (hashed) {
                    utils.compareHash(data.password, resp[0].password, function (resp1) {
                        if (resp1 === true) {
                            console.log(`JSON.stringify(resp[0], null, 2)`);
                            res.json(resp[0]);
                        } else {
                            var err = { "Invalid Password": "User found, but the password is invalid" };
                            console.log(err);
                            res.json(err);
                        }
                    });
                });
            } else {
                res.json({ "Error": "No such user" });
            }
        });
    }
});

/**
 *  Saved content
 *
 *  Pass data in this format:
 *
 *  {
 *      "_id": <idstr>,
 *      "keyword": <keyword>,
 *      "content": <content>
 *  }
 *
 */
router.post("/update_saved_content/", function(req, res) {

    var data = req.body;
    var errStr = "Got error attempting to update saved content";
    var err;

    // error handling
    if ( data._id === undefined || data.keyword === undefined || data.content === undefined ) {
        err = { "Error": "invalid data format" };
        console.log( `${errStr}:\n${err}` );
        res.json( err );
        return;
    }

    // create the update document
    var updoc;
    if ( data.keyword == "saved_searches" ) {
        updoc = {
            $addToSet: {
                savedSearches: data.content
            }
        };
    } else if ( data.keyword == "recent_searches" ) {
        updoc = {
            $addToSet: {
                recentSearches: data.content
            }
        };
    } else if ( data.keyword == "favorites" ) {
        updoc = {
            $addToSet: {
                favorites: data.content
            }
        };
    } else if ( data.keyword == "update_password") {
        utils.hashPassword(data.content, 5, function (hashed) {
            updoc.password = hashed;
        });
    } else {
        err = { "Error": "invalid data format. keyword is not recognized" };
        console.log( `${errStr}:\n${JSON.stringify( err, null, 2 )}` );
        res.json(err);
        return;
    }

    // create the query doc
    var querydoc = {
        _id: ObjectId(data._id)
    };

    // push to mongo
    mongo.updateDocument( querydoc, updoc, function( resp ) {
        var resStr = JSON.stringify( resp, null, 2 );
        var resp = JSON.parse(resStr);

        if ( resp.lastErrorObject.updatedExisting == true ) {
            var obj = {
                keyword: data.keyword,
                doc: data._id
            };
            console.log(`Successfully updated:\n${ JSON.stringify( obj, null, 2 ) }`)
            res.json({
                result: resp.value
            });
        } else {
            console.log( `Could not update document ${data._id}` );
            res.json({
                result: resp.lastErrorObject
            });
        }
    });

});



/*
// Testing function for clock in mongoDriver
router.post("/test_clock/", function(req, res) {
    console.log("Test clock endpoint");
    mongo.setUpClock();
});
*/


// query neo4j
router.post("/neo4j/", function (req, res) {
    var data = req.body;
    var statement = data.statement;
    var params = {};

    // construct params object
    Object.keys(data).forEach(function (element, key, _array) {
        params[element] = data[element];
        console.log(`elem: ${element}, key: ${key}\n, data ${element}: ${data[element]}`);
    });

    neo4j.query(statement, params)
        .then(function (resp) {
            res.json(resp);
        });
});

/** keyword query for neo4j
 *
 *  The request body should have the form:
 *
 *  {
 *    "keyword": "<keyword>",
 *    "limit":   "<limit>"
 *  }
 *
 */
router.post("/neo4j/keyword/", function (req, res) {

    var data = req.body;
    var statement = qstrings.keywordSearch;
    var params = {};

    // construct params object
    Object.keys(data).forEach(function (element, key, _array) {
        params[element] = data[element];
    });

    // add logic to sanitize the input here...

    neo4j.query(statement, params)
        .then(function (resp) {
            res.json(resp);
        });
});

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// all endpoints are prepended with '/api'
app.use('/api', router);

app.use(express.static("public/build/es6-bundled"));

app.get('*', function (req, res) {
    res.sendFile("public/build/es6-bundled/index.html", { root: '.' });
});

// add directories with the files we need

// Start the server instance
app.listen(port);

console.log(`Server is listening on port ${port}`);
