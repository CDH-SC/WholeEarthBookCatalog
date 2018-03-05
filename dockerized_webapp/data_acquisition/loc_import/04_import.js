/**
 * Import the items into the db
 */

var fs = require('fs');
var jsonArrayStream = require('json-array-streams');
var through = require("through2");

var neo4j = require('../../utils/neo4jDriver');
//var neo4j = require("neo4j-driver").v1

var logger = require('../../utils/log');
logger.level = 4;

var downloadsDirectory = 'data_acquisition/loc/';

function GetJSONFiles(directory) {
    let allFiles = fs.readdirSync(directory);
    let xmlFiles = [];
    for (let i = 0; i < allFiles.length; i++) {
        if (allFiles[i].endsWith('.json')) {
            xmlFiles.push(directory + allFiles[i]);
        }
    }
    return xmlFiles;
}

var files = GetJSONFiles(downloadsDirectory);
var dataset = [];

function IsNext() {
    return (dataset.length > 0 || files.length > 0);
}

function GetNext() {
    if (dataset.length == 0) {
        var file = files.pop();
        dataset = JSON.parse(fs.readFileSync(file));
    }
    return dataset.pop();
}

function Import() {
    var data = GetNext();
    neo4j.query(data.script, data.params).then(() => { Import(); });
}

Import();