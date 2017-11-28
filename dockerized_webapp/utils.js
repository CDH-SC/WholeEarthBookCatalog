/**
 * utilities
 */

"use strict";

var bcrypt = require("bcrypt");

// module
var utils = {};

// hash passwords
utils.hashPassword = function(password, saltRounds, callback) {
    bcrypt.hash(password, saltRounds)
        .then( callback )
        .catch(function (err) { console.log(`ERR: ${err}`) });
}

// compare hashes
utils.compareHash = function(password, hash, callback) {
    console.log(`hash: ${hash}`);
    bcrypt.compare(password, hash)
        .then( callback )
        .catch(function (err) { console.log(`ERR: ${err}`) });
};

// test
utils.test = function() {
    var ps = {};
    utils.hashPassword("abc", 3, function(hashed) { 
        console.log("hashed");
        ps.one = hashed;
    })
    .then(
        utils.hashPassword("abc", 3, function(hashed) {
            console.log("hashed");
            ps.two = hashed;
            console.log(`${JSON.stringify(ps)}`);
            utils.compareHash("abc", ps.one, function(res) { console.log(res) });
            utils.compareHash("abc", ps.two, function(res) { console.log(res) });
        })
    )
    .catch(function (err) { console.log(`ERR: ${err}`) });
}

// compare
utils.compare = function(res) {
    if (res == True) {console.log("true")}
    else {console.log("false")}
}

module.exports = utils;
