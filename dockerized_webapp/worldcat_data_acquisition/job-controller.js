/**
 * Controller to manage jobs
 */

"use strict";

var Agenda = require("agenda");
var MongoClient = require("mongodb").MongoClient;
var wcq = require("./wcq");
var assert = require("assert");
var util = require("util");

var mongoUrl = "mongodb://localhost:27017/agenda";

console.log(mongoUrl);

var agenda = new Agenda({
    db: { 
        address: mongoUrl
    }
});

agenda.define("query worldcat", function(job) {
    console.log("function body");
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err != null) {
            console.log(`got error: ${JSON.stringify(err, null, 2)}`);
        }
        console.log("connecting...")
        
        assert.equal(err, null);
        var collection = db.collection("worldcatJobs");

        // get next job from the database
        collection.find(
            {
                title: "jobDoc"
            },
            {
                queued: {
                    $slice: 1
                }
            }
        ).toArray( function(err, result) {
            console.log("querying...")
            assert.equal(err, null);
            
            for (var i = 0; i < result.length; i++ ) {
                console.log(`element ${i}:\n${JSON.stringify(result[i], null, 2)}`);
            }
            
            if ( result.length == 0) { console.log("No results found") }

            // result.queued
            // wcq.query(result.job);
        });

        // send the query
        // add the data to neo4j

        db.close();
    })

    console.log("done");

    // mark job as finished
})

agenda.on("ready", function() {
    agenda.every("15 seconds", "query worldcat");
    agenda.start();
})