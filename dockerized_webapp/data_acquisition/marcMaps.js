/**
 * 
 * data model for wcq
 *
 */

"use strict";

var general_filter = /^\[?(.*?)\]?\s?(\/|,|\.|:)?$/i
var name_filter = /^\[?(.*?)(,\s(.*?),?)?\]?$/i //\s?(\/|,|\.|:)?$/i

// tag to field mappings
var tags = {
    "020": {
        "a": {
            "field": "ISBN",
            "unknown_keys": [],
            "re_filter": /^\[?(.*?)\]?.*$/i,
            "mgroup": {
                "ISBN": 0
            }
        }
    },
    "100": {
        "a": {
            "field": "Author",
            "unknown_keys": [],
            "re_filter": name_filter,
            "mgroup": {
                "Author lname": 1,
                "Author fname": 3
            }
        }
    },
    "245": {
        "a": {
            "field": "Title",
            "unknown_keys": [],
            "re_filter": general_filter,
            "mgroup": {
                "Title": 1
            }
        }
    },
    "260": {
        "a": {
            "field": "Place",
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
            "field": "Publisher",
            "unknown_keys": [
                "[s.n.] :"
            ],
            "re_filter": general_filter,
            "mgroup": {
                "Publisher":1
            }
        },
        "c": {
            "field": "Date",
            "unknown_keys": [],
            "re_filter": /[0-9]{4}/,
            "mgroup": {
                "Date": 0
            }
        }
    }
}

module.exports = tags;