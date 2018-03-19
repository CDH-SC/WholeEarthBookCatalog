/**
 *
 * Server to manage data acquisition jobs
 *
 */

"use strict";

var assert = require("assert");
var express = require("express");
var mongo = require("./utils/mongoDriver.js");
var neo4j = require("./utils/neo4jDriver.js");
var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://localhost:27017/agenda";
var bodyParser = require("body-parser");

var app = express();
var router = express.Router();

/**
 *
 * Add an endpoint to add jobs
 *
 */
router.post("/add_jobs", function(req, res) {
    // parse request
    var jobs = req.body.jobs;

    console.log(JSON.stringify(jobs, null, 2));
    
    var updoc = {
        $addToSet: {
            queued: {
                $each: jobs
            }
        }
    }
 
    var updated = false;

    MongoClient.connect(mongoUrl, function(err, db) {
        var collection = db.collection("worldcatJobs");
        collection.findOneAndUpdate({ title: "jobDoc" }, updoc, function(err, resp) {
            if ( resp.lastErrorObject.updatedExisting == false ) {
                // need to create the document
                var doc = {
                    title: "jobDoc",
                    queued: jobs
                }

                collection.insert( doc, function(err, result) {
                    assert.equal(err, null);
                    res.json(result)
                })
                db.close();
            } else {
                res.json(resp);
                db.close();
            }
        })
    })    
});

router.get("/test",function(req, res) {
    console.log("hello world");
})

/**
 *
 * Add an endpoint to inspect jobs
 *
 */

/**
 *
 * Add an endpoint to cancel jobs
 *
 */

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", router);

app.listen(29001);