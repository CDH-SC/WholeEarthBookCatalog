/**
 *
 * basic script to query worldcat
 *
 */

"use strict";

var wcq = require("./wcq");
var xmljs = require("xml-js");
var rp = require("request-promise");
var wskey = process.env.WSKEY;
var neo4j = require("./utils/neo4jDriver");

// main script
var options = {
    uri: "http://www.worldcat.org/webservices/catalog/search/sru",
    qs: {
        wskey: wskey,
        query: "\"Tolkien\"",
        json: false,
        maximumRecords: 20
    }
}

rp(options)
    .then( function(res) {
        var json = xmljs.xml2js(res, {
            compact: true,
            spaces: 4,
        });
        // console.log(JSON.stringify(json, null, 2));
        var data = wcq.parseResp(json);
        var qstring = wcq.constructQuery(data);
        neo4j.query(qstring)
	.then(function(res) {
	    console.log(`${JSON.stringify(res, null, 2)}`);
	})
	.catch(function(err) {
            console.log(`$JSON.stringify(err, null, 2)}`);
	});
    })
    .catch( function(err) {
        console.log(`got error during API call:\n${JSON.stringify(err, null, 2)}`);
    })
