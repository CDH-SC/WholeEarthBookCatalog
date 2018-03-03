/**
 * 
 * module to facilitate worldcat queries
 *
 */

"use strict";

var tags = require("./marcMaps")

// module
var wcq = {};

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
    if ( Array.isArray(records) ) {
        for ( var i = 0; i < records.length; i++ ) {
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
        },
        "Places": Array(),
        "Publishers": Array(),
        "People": Array()
    };

    for ( var i = 0; i < data.length; i++ ) {
        var tag = data[i]._attributes.tag;
        if ( tags[tag] !== undefined ) {
            if ( Array.isArray(data[i].subfield) ) {
                for ( var j = 0; j < data[i].subfield.length; j++ ) {
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
    
    if (tags[tag][code] !== undefined ) {
        var unknown_keys = tags[tag][code].unknown_keys;
        var mgroup = tags[tag][code].mgroup;
        var re_filter = tags[tag][code].re_filter;
    }

    if ( unknown_keys !== undefined && mgroup !== undefined ) {
        var unknown = false;
        for ( var i = 0; i < unknown_keys.length; i++ ) {
            if ( unknown_keys[i] == val ) { unknown = true; }
        }

        if ( !unknown ) {
            // regex filtering
            var m = val.match(re_filter);
            
            // debug
            for ( var key in mgroup ) {
                if ( key == "Author lname" ) {
                    if ( obj.People.length == 0 ) {
                        obj.People.push({});
                    }
                    if ( obj.People[obj.People.length - 1].lname === undefined ) {
                        obj.People[obj.People.length - 1].lname = m[ mgroup[key] ];
                    } else {
                        obj.People.push({
                            lname: m[ mgroup[key] ]
                        });
                    }
                }
                if ( key == "Author fname" ) {
                    if ( obj.People.length == 0 ) {
                        obj.People.push({});
                    }
                    if ( obj.People[obj.People.length - 1].fname === undefined ) {
                        obj.People[obj.People.length - 1].fname = m[ mgroup[key] ];
                    } else {
                        obj.People.push({
                            fname: m[ mgroup[key] ]
                        });
                    }
                }
                if ( key == "ISBN" ) {
                    obj.Edition.ISBN.push( m[ mgroup[key] ] );
                }
                if ( key == "Title" ) {
                    obj.Edition.Title = m[mgroup[key]];
                }
                if (key == "Place" ) {
                    obj.Places.push({
                        placename: m[ mgroup[key] ]
                    });
                }
                if ( key == "Publisher" ) {
                    obj.Publishers.push({
                        pubname: m[ mgroup[key] ]
                    });
                }
                if (key == "Date" ) {
                    obj.Edition.Date = m[ mgroup[key] ];
                }
            }
        }
    }
}

module.exports = wcq;