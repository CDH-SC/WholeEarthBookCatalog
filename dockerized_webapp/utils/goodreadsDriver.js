"use strict";

var http = require("http");
var request = require("request");
var xmlStream = require("xml-streamer");
var querystring = require("querystring");
var xml2js = require("xml2js").parseString;
var libxmljs = require("libxmljs");
var assert = require("assert");
const goodreads = require('goodreads-api-node');


var goodreadsDriver = {};


const myCredentials = {
    key: 'MY_KEY',
    secret: 'MY_SECRET'
};

const gr = goodreads(myCredentials);


// From goodreads API node.js library
goodreadsDriver.getBooks = function() {
    gr.getBooksByAuthor('175417')
    .then(console.log);
}


// create URL for search
goodreadsDriver.searchURL = function(search) {
    search = querystring.stringify({q: search});
    console.log("Stringify: " + search);
    var work = 'https://www.goodreads.com/search.xml?key=' + myCredentials.key + "&" + search;

    console.log(work);

    return work;
}



// search goodreads then convert response xml to JSON
goodreadsDriver.goodReadSearch = function(search, callback) {
    var searchadd = goodreadsDriver.searchURL(search);

    request(searchadd, function(error, response, body) {

      assert.equal(error, null);

      console.log("xml: " + body);

      var xmlDoc = libxmljs.parseXmlString(body);
      var products = xmlDoc.find('//work');
      var jsonObs = [];

      for(var i = 0; i < products.length; i++) {

          xml2js(products[i], function(error, result) {
              assert.equal(error, null);
              jsonObs.push(result);

          });
      }

      callback(jsonObs);

    });
}




module.exports = goodreadsDriver;
