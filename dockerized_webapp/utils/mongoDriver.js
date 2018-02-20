/**
 *  Wrapper for the mongo client, essentially
 *
 */
"use strict";

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var moment = require('moment');
var url = `mongodb://${process.env.MONGO_URL}`;

// module
var driver = {};

driver.findDocument = function(query, callback) {

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection("documents");

        collection.find(query).toArray(function(err, doc) {
            assert.equal(err, null);
            callback(doc);
        });
        db.close();
    });
}

driver.insertDocument = function(doc, callback) {

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection("documents");

        collection.insert(doc, function(err, result) {
            assert.equal(err, null);
            callback(result);
        });
        db.close();
    });
}

driver.updateDocument = function(doc, updatedoc, callback) {

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection("documents");

        collection.findOneAndUpdate(doc, updatedoc, { returnOriginal: false }, function(err, result) {
            assert.equal(err, null);
            callback(result);
        });
        db.close();
    });
}

// Values for clock to monitor number of searches
var midnight = "23:59:59";
var deductible;
const searchAmount = 50000;

// Clock object
function My_Clock() {
    this.currTime = moment().format("HH:mm:ss");
}

// updates clock every second
My_Clock.prototype.run = function() {
    setInterval(this.update.bind(this), 1000);
}

// Clock update function
My_Clock.prototype.update = function() {

    this.currTime = moment().format("HH:mm:ss");
    console.log(moment().format("HH:mm:ss"));
    // var testMidnight = moment().endOf('day').format("HH:mm:ss");

    // Reset deductible at midnight
    if (midnight === this.currTime) {
        this.resetDeductible();
    }
}

// Resetting deductible to 50,000 searches
My_Clock.prototype.resetDeductible = function() {
    console.log("Reset deductible");
    deductible = 50000;
}

// Set deductible and run clock
driver.setUpClock = function() {
    deductible = 50000;
    console.log("Setting up clock");
    var clock = new My_Clock();
    clock.run();
}


module.exports = driver;