/**
 * Import the items into the db
 */

var fs = require('fs');
var jsonArrayStream = require('json-array-streams');
var through = require("through2");

var neo4j = require('../utils/neo4jDriver');
//var neo4j = require("neo4j-driver").v1

var logger = require('../utils/log');
logger.level = 4;

var downloadsDirectory = '../loc/';

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

function CreateScript(obj) {
    // if author, get author add "WROTE" relationship
    var author = obj.Author;
    var script = "";
    if (author != undefined && author != null) {
        script += "MERGE (a:Person {Name:$Author}) ";
    }
    script += "CREATE (b:Item { ";
    var propertyStatements = [];
    for (var propertyName in obj) {
        propertyStatements.push(propertyName + ": $" + propertyName);
    }
    script += propertyStatements.join(", ");
    script += "}) ";
    if (author != undefined && author != null) {
        script += "MERGE (a) -[r:WROTE]-> (b) ";
    }
    script += "RETURN b";
    return script;
}

function Import() {
    var data = GetNext();
    var script = CreateScript(data);
    // neo4j.query(script, data).then(() => { Import(); });
    var queryResponse = neo4j.query(script, data);
    queryResponse.response.then(() => { 
        queryResponse.session.close();
        queryResponse.driver.close();
        Import(); 
    });
}

Import();
