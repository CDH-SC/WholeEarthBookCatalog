/**
 * 
 * Controller to manage worldcat import jobs
 * 
 */

"use strict";

var Agenda = require("agenda");
var MongoClient = require("mongodb").MongoClient;
var wcq = require("./wcq");
var assert = require("assert");
var util = require("util");
var fs = require("fs");
var async = require("async");
var MONGO_URL = process.env.MONGO_URL;

var mongoUrl = `mongodb://${MONGO_URL}/agenda`;

console.log("defined globals/imports");
console.log(`mongoUrl: ${mongoUrl}`);

/**
 * 
 * Need an init function that will:
 *  + verify that the document exists in mongo
 *  + parse the job files from local dir and add jobs to mongo
 * 
 */
var init = function() {
    console.log("init");
    var jobsArr = new Array();
    fs.readdir("./jobs", (err, files) => {
        assert.equal(err, null);
        files.forEach(file => {
            fs.readFile(`./jobs/${file}`, "utf-8", (err, data) => {
                assert.equal(err, null);
                var obj = JSON.parse(data);
                var jobs = obj.jobs;
                jobsArr = getJobsArray( jobs );
                addJobs( jobsArr )
            })
        })
    })
}

/**
 * Construct an array of job documents that can directly be added to mongo
 * 
 * @param {array} jobs 
 */
var getJobsArray = function(jobs) {
    console.log("getJobsArray");
    var jobsArr = new Array();
    jobs.forEach((job) => {
        console.log(job);                    
        var date = new Date().toISOString();
        date = new Date(date);
        var doc = {
            "jobString": job,
            "completed": false,
            "date_added": date
        }
        jobsArr.push(doc)
    })
    return jobsArr;
}

/**
 * Add the array of job documents to mongo
 * 
 * @param {array} jobs 
 */
var addJobs = function( jobs ) {
    console.log("addJobs");
    // create collection if it does not exist
    MongoClient.connect(mongoUrl, (err, db) => {
        assert.equal(err, null)
        // create collection if it does not exist
        db.listCollections({"name": "worldcatJobs"}).toArray()
        .then( (items) => {
            if ( items.length == 0 ) {
                db.createCollection( "worldcatJobs ")
            }
            return db
        })
        .then( (db) => {
            var worldcatJobs = db.collection("worldcatJobs")
            worldcatJobs.createIndex( { "jobString": 1 }, { unique: true } )
            worldcatJobs.insertMany(jobs, { ordered: false }, (err, res) => {
                console.log(`inserted ${JSON.stringify(res.nInserted, null, 2)} new jobs`)
                db.close();
            })
        })
    })
}

// initialize and run the process
setTimeout(function() {
    
    var agenda = new Agenda({
        db: { 
            address: mongoUrl
        }
    });


    agenda.define("query worldcat", function(job) {
        console.log("define query worldcat");
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
                    setTimeout(function() {}, 30000)
                    process.exit(0);
                }
            })
        })
    })

	agenda.on("ready", function() {
	    init();
	    setTimeout(function() {
            agenda.every("30 seconds", "query worldcat");
            agenda.start();
        }, 30000); // timeout to allow init to complete
    })

}, 30000);