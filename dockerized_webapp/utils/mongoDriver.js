/**
 *  Wrapper for the mongo client, essentially
 *
 */
"use strict";

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = `mongodb://${process.env.MONGO_URL}`;

// module
var driver = {};

// Get the documents collection
driver.findDocument = function(query, callback) {

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection("documents");

        // find a document
        collection.find(query).toArray(function(err, doc) {
            assert.equal(err, null);
            callback(doc);
        });
        db.close();
    });
}

// insert some docs
driver.insertDocument = function(doc, callback) {

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection("documents");

        // insert a document
        collection.insert(doc, function(err, result) {
             assert.equal(err, null);
             callback(result);
        });
        db.close();
    });
}

// update a document
driver.updateDocument = function(doc, updatedoc, callback) {

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        var collection = db.collection("documents");


        // update document
        collection.updateOne(doc, updatedoc, function (err, result) {
            assert.equal(err, null);
            callback(result);
        });
        db.close();
    });
}



// export the driver
module.exports = driver;
