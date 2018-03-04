/**
 * utilities
 */

"use strict";

var bcrypt = require("bcrypt");

// module
var utils = {};

// hash passwords
utils.hashPassword = function (password, saltRounds, callback) {
    bcrypt.hash(password, saltRounds)
        .then(callback)
        .catch(function (err) { });
};

// compare hashes
utils.compareHash = function(password, hash, callback) {
    
    bcrypt.compare(password, hash)
        .then( callback )
        .catch(function (err) { });
};

module.exports = utils;
