/**
 * Controller to manage jobs
 */

"use strict";

var Agenda = require("agenda");
var MongoClient = require("mongodb").MongoClient;
var wcq = require("./wcq");
var assert = require("assert");
var util = require("util");
var fs = require("fs");

var mongoUrl = "mongodb://mongo/agenda";

console.log(mongoUrl);

var agenda = new Agenda({
    db: { 
        address: mongoUrl
    }
});

/** Add a job string to mongo
 * 
 * @param {string} jobStr
 * @param {obj} client
 *  
 */
var addJobsToMongo = function(jobArray) {
    // if a doc with this string does not exist, add it
    MongoClient.connect(mongoUrl, function(err, db) {
       var worldcatJobs = db.collection("worldcatJobs");
       worldcatJobs.insertMany(jobArray, (result, err) => {
           console.log(JSON.stringify(result, null, 2));
       }) 
    })

    /**
    var worldcatJobs = db.collection("worldcatJobs");
    worldcatJobs.find({
        "jobString": jobStr
    }).toArray( function(err, results) {
        assert.equal(err, null);
        results.forEach( job => {
            console.log(`job:\n${JSON.stringify(job, null, 2)}`);
        });
        if ( results.length == 0 ) {
            
            // create the doc

            worldcatJobs.insertMany(jobArray, (result, err) => {
                console.log(JSON.stringify(result, null, 2));
            });
            console.log(`Added new job for job string ${jobStr}`);
        } else {
            console.log(`Job is already scheduled or has been completed for job string ${jobStr}`);
        }
    });
    */
}

/**
 * 
 * Need an init function that will:
 *  + verify that the document exists in mongo
 *  + parse the job files from local dir and add jobs to mongo
 * 
 */
var init = function() {
    console.log("Initializing job controller...");
    var jobArray = new Array();

    console.log("Connecting to MongoDB...")
    fs.readdir("./jobs", (err, files) => {
            
        console.log("Reading job files...");
        files.forEach(file => {
            fs.readFile(`./jobs/${file}`, "utf-8", (err, data) => {
                var obj = JSON.parse(data);
                console.log(`Read object:\n${JSON.stringify(obj, null, 2)}\nFrom file:\n${file}`);
                obj.jobs.forEach(job => {
                    MongoClient.connect(mongoUrl, function(err, db) {
                        var worldcatJobs = db.collection("worldcatJobs");
                        worldcatJobs.findOne({
                            "jobString": job
                        }, function(result) {
                            if ( result == null) {
                                var date = new Date().toISOString();
                                date = new Date(date);
                                worldcatJobs.insertOne({
                                    "jobString": job,
                                    "completed": false,
                                    "date_added": date
                                }, (err, result) => {
                                    assert.equal(err, null);
                                    db.close();
                                    console.log(JSON.stringify(result, null, 2));
                                })
                            }
                        })
                    })
                });
            })
        })
    })
    

}

agenda.define("query worldcat", function(job) {
    MongoClient.connect(mongoUrl, function(err, db) {
        console.log("connecting...")
        
        assert.equal(err, null);
        var jobs = db.collection("worldcatJobs");

        // get next job from the database
        jobs.findOne({
            "completed": false
        }, function(err, result) {
            assert.equal(err, null);
            if ( result != null ) {
                console.log(JSON.stringify(result, null, 2));
                wcq.query(result.jobString);
                
                // mark as completed
                jobs.findOneAndUpdate({ "jobString": result.jobString },
                                      { $set: { completed: true } },
                                      { returnOriginal: false }, function(err, result) {
                    assert.equal(err, null);
                    console.log(JSON.stringify(result, null, 2))
                    db.close();
                })
            } else {
                console.log("No jobs scheduled currently...")
                db.close();
            }
        })
    })
})


agenda.on("ready", function() {
    init();
    agenda.every("15 seconds", "query worldcat");
    agenda.start();
})
