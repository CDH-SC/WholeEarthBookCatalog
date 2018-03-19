/**
 *
 * basic script to query worldcat
 *
 */

"use strict";

var wcq = require("./wcq");
var q = process.argv[2];

wcq.query(q)
