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

        collection.findOneAndUpdate(doc, updatedoc, { returnOriginal: false }, function (err, result) {
            assert.equal(err, null);
            callback(result);
        });
        db.close();
    });
}


module.exports = driver;
