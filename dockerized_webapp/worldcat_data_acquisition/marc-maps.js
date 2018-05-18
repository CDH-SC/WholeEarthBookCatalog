/**
 * 
 * data model for wcq
 *
 */

"use strict";

var general_filter = /^\[?(.*?)\]?\s?(\/|,|\.|:|;)?$/i
var name_filter = /^\[?((.*?)(,\s(.*?))),?\]?$/i
var pub_filter = /^(\[.*\][\/,\.:;]?\s?)?([a-zA-Z\s-\.\(\)]*),?$/i

// tag to field mappings
var tags = {
    "020": {
        "a": {
            "unknown_keys": [],
            "re_filter": /^\[?(.*?)\]?.*$/i,
            "mgroup": {
                "ISBN": 0
            }
        }
    },
    "100": {
        "a": {
            "unknown_keys": [],
            "re_filter": name_filter,
            "mgroup": {
                "Author": 1
            }
        }
    },
    "245": {
        "a": {
            "unknown_keys": [],
            "re_filter": general_filter,
            "mgroup": {
                "Title": 1
            }
        }
    },
    "260": {
        "a": {
            "unknown_keys": [
                "[S.l.] :",
                "[Place of publication not identified] :"
            ],
            "re_filter": general_filter,
            "mgroup": {
                "Place": 1
            }
        },
        "b": {
            "unknown_keys": [
                "[s.n.] :"
            ],
            "re_filter": pub_filter,
            "mgroup": {
                "Publisher": 2
            }
        },
        "c": {
            "unknown_keys": [],
            "re_filter": /[0-9]{4}/,
            "mgroup": {
                "Date": 0
            }
        }
    }
}

module.exports = tags;