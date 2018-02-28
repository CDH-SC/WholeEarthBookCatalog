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

// main script
var options = {
    uri: "http://www.worldcat.org/webservices/catalog/search/sru",
    qs: {
        wskey: wskey,
        query: "Tolstoy",
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
        console.log(JSON.stringify(data, null, 2));
    })
    .catch( function(err) {
        console.log(`got error during API call:\n${JSON.stringify(err, null, 2)}`);
    })