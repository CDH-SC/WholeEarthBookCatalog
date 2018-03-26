/**
 * 
 * module to facilitate worldcat queries
 *
 */

"use strict";

var tags = require("./marcMaps")
var qstrings = require("./utils/querystrings");
var neo4j = require("./utils/neo4jDriver");
var fs = require("fs");
var path = require("path");
var format = require("string-format");
var rp = require("request-promise");
var xmljs = require("xml-js");
var crypto = require("crypto");
var wskey = process.env.WSKEY;
var MongoClient = require("mongodb").MongoClient;

// module
var wcq = {};

/** 
 * query worldcat and handle the response
 * 
 * maybe allow the user to pass their own options?
 * 
 */
wcq.query = function(query) {

    var options = {
        uri: "http://www.worldcat.org/webservices/catalog/search/sru",
        qs: {
            wskey: wskey,
            query: `\"${query}\"`, // quotations required per worldcat's CQL standard
            json: false,
            maximumRecords: 20
        }
    }

    // query worldcat
    console.log(`query options:\n${JSON.stringify(options, null, 2)}`);

    rp(options)
        .then(function(res) {
            var json = xmljs.xml2js(res, {
                compact: true,
                spaces: 4,
            });

            // construct the querystring and send it to neo4j
            var data = wcq.parseResp(json);
            var qstring = wcq.constructQuery(data);
            var qr = neo4j.query(qstring)

            fs.writeFile("../app/public/src/d3QueryResponse.json", qstring, 'utf8', function(err) {
                if (err) {
                    console.error(err);
                }
            });



            // handle the response
            qr.response.then(function(resp) {
                    console.log(`${JSON.stringify(resp, null, 2)}`);
                })
                .catch(function(err) {
                    console.log(`${JSON.stringify(err, null, 2)}`);
                });

            // close neo4j driver and session
            qr.session.close();
            qr.driver.close();
        })
        .catch(function(err) {
            console.log(JSON.stringify(err, null, 2));
        })
}

/** 
 * 
 * parse the xml response to a WorldCat query
 * 
 */
wcq.parseResp = function(res) {

    var obj = {
        records: Array()
    };

    var records = res.searchRetrieveResponse.records.record;
    if (Array.isArray(records)) {
        for (var i = 0; i < records.length; i++) {
            var record = records[i].recordData.record;
            var data = record.datafield;
            var pd = parseData(data);
            obj.records.push(pd);
        }
    } else {
        var records = records.recordData.record;
        var data = record.datafield;
        var pd = parseData(data);
        obj.records.push(pd);
    }

    return obj;
}

/** 
 * 
 * helper for parseResp; process the main data in the record
 * 
 */
var parseData = function(data) {

    var obj = {
        "Edition": {
            ISBN: Array(),
            Title: "<TITLE_NOT_FOUND>",
            Date: -9999
        },
        "Places": Array(),
        "Publishers": Array(),
        "People": Array()
    };

    for (var i = 0; i < data.length; i++) {
        var tag = data[i]._attributes.tag;
        if (tags[tag] !== undefined) {
            if (Array.isArray(data[i].subfield)) {
                for (var j = 0; j < data[i].subfield.length; j++) {
                    var code = data[i].subfield[j]._attributes.code;
                    var val = data[i].subfield[j]._text;
                    parseSubfield(code, val, tag, tags, obj);
                }
            } else {
                var code = data[i].subfield._attributes.code;
                var val = data[i].subfield._text;
                parseSubfield(code, val, tag, tags, obj);
            }
        }
    }

    return obj;
}

/**
 * 
 * helper for parseData; process the subfield portion
 * 
 */
var parseSubfield = function(code, val, tag, tags, obj) {

    if (tags[tag][code] !== undefined) {
        var unknown_keys = tags[tag][code].unknown_keys;
        var mgroup = tags[tag][code].mgroup;
        var re_filter = tags[tag][code].re_filter;
    }

    if (unknown_keys !== undefined && mgroup !== undefined) {
        var unknown = false;
        for (var i = 0; i < unknown_keys.length; i++) {
            if (unknown_keys[i] == val) { unknown = true; }
        }

        if (!unknown) {
            // regex filtering
            var m = val.match(re_filter);

            for (var key in mgroup) {
                if (key == "Author lname") {
                    if (obj.People.length == 0) {
                        obj.People.push({});
                    }
                    if (obj.People[obj.People.length - 1].lname === undefined) {
                        obj.People[obj.People.length - 1].lname = m[mgroup[key]];
                    } else {
                        obj.People.push({
                            lname: m[mgroup[key]]
                        });
                    }
                }
                if (key == "Author fname") {
                    if (obj.People.length == 0) {
                        obj.People.push({});
                    }
                    if (obj.People[obj.People.length - 1].fname === undefined) {
                        obj.People[obj.People.length - 1].fname = m[mgroup[key]];
                    } else {
                        obj.People.push({
                            fname: m[mgroup[key]]
                        });
                    }
                }
                if (key == "ISBN") {
                    obj.Edition.ISBN.push(m[mgroup[key]]);
                }
                if (key == "Title") {
                    obj.Edition.Title = m[mgroup[key]];
                }
                if (key == "Place") {
                    obj.Places.push({
                        placename: m[mgroup[key]]
                    });
                }
                if (key == "Publisher") {
                    obj.Publishers.push({
                        pubname: m[mgroup[key]]
                    });
                }
                if (key == "Date") {
                    obj.Edition.Date = parseInt(m[mgroup[key]]);
                }
            }
        }
    }
}

/**
 * 
 * construct the querystring for some worldcat data
 * 
 */
wcq.constructQuery = function(data) {

    var qstring = "";
    var records = data.records;
    var q_obj = "";
    var tmpstr1 = "";

    for (var i = 0; i < records.length; i++) {
        qstring = `${qstring}${construct_qstring(records[i])}\n`;
    }

    return qstring;
}

/**
 * 
 * helper method for constructQuery
 *  
 */
var construct_qstring = function(query_obj) {

    var ids = {
        ed: "",
        places: Array(),
        publishers: Array(),
        people: Array()
    };

    var strs = {
        ed: "",
        place: "",
        publishers: "",
        people: "",
        relationships: ""
    }

    var querystring = "";
    var placeStr = qstrings.createPlace;
    var personStr = qstrings.createPerson;
    var editionStr = qstrings.createEdition;
    var publisherStr = qstrings.createPublisher;
    var pubsInRelStr = qstrings.createPublishesInRelation;
    var pubRelStr = qstrings.createPublishedRelation;
    var wroteStr = qstrings.createWroteRelation;

    Object.keys(query_obj).forEach(function(element, key, _array) {
        if (element == "Edition") {
            var ed = query_obj[element];
            ed.var_id = crypto.randomBytes(32).toString("hex").replace(/[0-9]/g, "");
            ids.ed = ed.var_id;
            ed.ISBN = JSON.stringify(ed.ISBN);
            strs.ed = format(editionStr, ed);
        } else if (element == "Places") {
            var places = query_obj[element];
            for (var i = 0; i < places.length; i++) {
                var place = places[i];
                place.var_id = crypto.randomBytes(32).toString("hex").replace(/[0-9]/g, "");
                ids.places.push(place.var_id);
                strs.place = `${strs.place}${format( placeStr, place )}`;
            }
        } else if (element == "Publishers") {
            var publishers = query_obj[element];
            for (var i = 0; i < publishers.length; i++) {
                var publisher = publishers[i];
                publisher.var_id = crypto.randomBytes(32).toString("hex").replace(/[0-9]/g, "");
                ids.publishers.push(publisher.var_id);
                strs.publishers = `${strs.publishers}${format( publisherStr, publisher )}`
            }
        } else if (element == "People") {
            var people = query_obj[element];
            for (var i = 0; i < people.length; i++) {
                var person = people[i];
                person.var_id = crypto.randomBytes(32).toString("hex").replace(/[0-9]/g, "");
                ids.people.push(person.var_id);
                strs.people = `${strs.people}${format( personStr, person )}`;
            }
        }
    })

    for (var i = 0; i < ids.people.length; i++) {
        var wroteRel = { author: ids.people[i], book: ids.ed }
        strs.relationships = `${strs.relationships}${format( wroteStr, wroteRel )}\n`;
    }

    for (var i = 0; i < ids.places.length; i++) {
        for (var j = 0; j < ids.publishers.length; j++) {
            var pubsInRel = { pubname: ids.publishers[j], place: ids.places[i] }
            var pubRel = { pubname: ids.publishers[j], book: ids.ed }
            strs.relationships = `${strs.relationships}\n${format( pubsInRelStr, pubsInRel )}\n${format( pubRelStr, pubRel )}\n`
        }
    }

    var str = ""
    Object.keys(strs).forEach(function(key, ind, _array) {
        str = `${str}${strs[key]}\n`
    });

    return str
}

module.exports = wcq;