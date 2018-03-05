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
var neo4j = require("../../utils/neo4jDriver");
var q = process.argv[2];

// main script
var options = {
    uri: "http://www.worldcat.org/webservices/catalog/search/sru",
    qs: {
        wskey: wskey,
        query: `\"${q}\"`,
        json: false,
        maximumRecords: 20
    }
}

console.log(`query: ${options.qs.query}\n`);

rp(options)
    .then( function(res) {
        var json = xmljs.xml2js(res, {
            compact: true,
            spaces: 4,
        });
        // console.log(JSON.stringify(json, null, 2));
        var data = wcq.parseResp(json);
        var qstring = wcq.constructQuery(data);

	console.log(`qstring:\n${JSON.stringify(qstring, null, 2)}`);

        var qr = neo4j.query(qstring)
	qr.response.then(function(resp) {
	    console.log(`${JSON.stringify(resp, null, 2)}`);
	})
	.catch(function(err) {
            console.log(`${JSON.stringify(err, null, 2)}`);
	});
    })
    .catch( function(err) {
        console.log(`got error during API call:\n${JSON.stringify(err, null, 2)}`);
    })
