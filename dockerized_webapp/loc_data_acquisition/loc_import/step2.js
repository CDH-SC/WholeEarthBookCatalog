import { isNullOrUndefined } from 'util';

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
    console.log(obj);
    var script = "";
    if (isNullOrUndefined(obj.person))
    {
        obj.person = "unknown";
    }
    if (isNullOrUndefined(obj.publisher))
    {
        obj.publisher = "unknown";
    }
    if (isNullOrUndefined(obj.place))
    {
        obj.place = "unknown"; 
    }
    if (isNullOrUndefined(obj.editionISBN))
    {
        obj.editionISBN = "none"; 
    }
    if (isNullOrUndefined(obj.editionTitle))
    {
        // really bad, want the error
    }
    if (isNullOrUndefined(obj.editionDate))
    {
        obj.editionDate = "unknown"; 
    }

    return [
        `MERGE (a:Person {name:$person}) 
        MERGE (b:Publisher {name:$publisher}) 
        MERGE (c:Place {name:$place}) 
        MERGE (d:Edition {isbn:$editionISBN})
        SET d.title = $editionTitle, d.date = $editionDate
        MERGE (a)-[rad:WROTE]->(d) 
        MERGE (b)-[rbd:PUBLISHED]->(d)  
        MERGE (b)-[rbc:PUBLISHES_IN]->(c)  
        MERGE (d)-[rdc:PUBLISHED_IN]->(c)
        RETURN d;`, 
        obj
    ];
}

function Import() {
    if(IsNext()) {
        var data = GetNext();
        var script = CreateScript(data);
        // neo4j.query(script, data).then(() => { Import(); });
        neo4j
            .action(script[0], script[1])
            .then(function(result) {
                console.log("Imported: " + script[1].editionTitle);
                Import();
            })
            .catch(function(ex) {
                console.log("Unable to Import: " + script[1].editionTitle);
                Import();
            }); 
    }
    // var queryResponse = neo4j.query(script, data);
    // queryResponse.response.then(() => { 
    //     queryResponse.session.close();
    //     queryResponse.driver.close();
    //     Import(); 
    // });
}

Import();
