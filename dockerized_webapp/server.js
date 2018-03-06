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
var clock = require("./utils/clock.js");
var goodreadsDriver = require("./utils/goodreadsDriver.js");


// add user
router.post("/add_user/", function (req, res) {
    var data = req.body;
    

    if (data.username === undefined || data.password === undefined) {
        var err = { "Error": "invalid data format. Users must have both a username and password" };
        
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
                
                res.json(err);
            } else {
                // encrypt password
                utils.hashPassword(data.password, 5, function (hashed) {
                    userdoc.password = hashed;
                    //userdoc.recent =
                    mongo.insertDocument(userdoc, function (resp) {
                        
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
                            
                            res.json(resp[0]);
                        } else {
                            var err = { "Invalid Password": "User found, but the password is invalid" };
                            
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
            
            res.json({
                result: resp.lastErrorObject
            });
        }
    });

});


// GoodReads search endpoint
router.post("/goodreads/", function(req,res) {
    var data = req.body;
    if ( data.search === undefined) {
        err = { "Error": "invalid data format" };
        console.log( `${errStr}:\n${err}` );
        res.json( err );
        return;
    }

    console.log("Post: " + data);

    goodreadsDriver.goodReadSearch(data.search, function(jsArr) {
        var i = 1;
        jsArr.forEach(function(value) {
            console.log("\nSearch " + i + " \n" +JSON.stringify(value));
            i++;
        });

    });
    //goodreadsDriver.getBooks();
});

/** keyword query for neo4j
 *
 *  The request body should have the form:
 *
 *  {
 *    "advanced": "<bool>",
 *    "basic_query": "<string>",
 *    "terms": "<object>",
 *    "limit":   "<limit>"
 *  }
 *
 */
router.post("/neo4j/", function (req, res) {

    var data = req.body;
    console.log(`request:\n${JSON.stringify(data, null, 2)}`);

    var statement = qstrings.keywordSearchExample;
    var params = {};

    if ( data.advanced == false ) {
        params.regex = `(?i).*${data.basic_query}.*`;
        params.limit = data.limit;
    }

    /**
    // construct params object
    Object.keys(data).forEach(function (element, key, _array) {
        if ( element == "keyword" ) {
            params["regex"] = `(?i).*${data[element]}.*`
        } else if ( element == "limit" ){
            params["limit"] = data[element];
        }
    });
    */

    // add logic to sanitize the input here...

    console.log(`statement:\n${JSON.stringify(statement, null, 2)}\n
		 params:\n${JSON.stringify(params, null, 2)}\n`);

    var q = neo4j.query(statement, params);
    q.response.then(function (resp) {
            res.json(resp);
        })
        .catch(function (err) {
            var errstr = "This process was rejected. Please double check that your input follows the correct form";
            console.log(errstr)
            res.json({
                "Message": errstr,
                "Error": err
            });
        });
    q.driver.close();
    q.session.close();
});

router.post("/neo4j/get_graph/", function (req, res) {
    var statement = qstrings.getGraphJSON;

    neo4j.query(statement, {})
        .then(function (resp) {

            // process response
            // var resStr = JSON.stringify( resp, null, 2 );
            // var resp = JSON.parse(resStr);

            var fields = resp.records[0]._fields
            var nodes = new Array();
            var edges = new Array();
            
            

            for (var i = 0; i < fields[0].length; i++) {
                
                nodes.push({
                    caption: ( fields[0][i].properties.title || fields[0][i].properties.name ),
                    type: fields[0][i].labels[0],
                    id: fields[0][i].identity.low
                });
            }

            for (var i = 0; i < fields[1].length; i++) {
                
                edges.push({
                    source: fields[1][i].start.low,
                    target: fields[1][i].end.low,
                    caption: fields[1][i].type
                })
            }

            var graphJSON = {
                nodes: nodes,
                edges: edges
            }

            res.json(graphJSON);
        })
        .catch(function (err) {
            res.json({"Error": `${JSON.stringify(err)}`});
        });
});

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// all endpoints are prepended with '/api'
app.use('/api', router);

app.use(express.static("public/build/es6-bundled"));

app.get('dhc-*', function (req, res) {
    res.sendFile("public/build/es6-bundled/index.html", { root: '.' });
});

// add directories with the files we need

// Start the server instance
app.listen(port);


