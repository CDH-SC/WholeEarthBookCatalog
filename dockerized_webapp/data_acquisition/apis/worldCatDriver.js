/*
 
     * Example script of initial execution of search queries through WorldCat Search 
     *
     */

var assert = require("assert");
var http = require("http");
var neo4j = require("neo4j-driver").v1;
var cors = require('cors');
var exdefs = require("../exdefs");
var fs = require("fs");
var request = require('sync-request');

var jsdom = require("jsdom");
var $ = require('jquery')(jsdom.jsdom().parentWindow);
var query = null;
var startPosition = 0;
var searchLimit = 0;


//need to continually monitor the searches being done


const MAX_SEARCHES = 50000;
setTimeout(makeFetch, 5000);

var url = "";
var query = "";
//start position set as default 
//search limit per page set as default 


function retrieveURL() {
    //translate to front end 

}

function retrieveQuery(data) {
    //translate to front end


}

function makeFetch(query, url) {

    // var url = "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=robert%20sheckley&format=atom&start=1&count=10&cformat=mla&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu";
    //base url for testing 
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'text';

    request.onload = function() {
        repo.textContent = request.response;
        data = request.response;
    }

    request.send();
    return data;

}

function convertXML(data) {
    jsonData = xmlToJSON.parseString(data);
    return jsonData;
}

function maptoEntry(jsonData) {
    //need help in translating to front end 


}

function importToNeo4j(jsonData, logger) {
    let record = {
        exdefs: [

        ]
    }

    let instance = neo4j.driver("bolt://localhost:7687");
    let session = instance.session();

    let promise = session.run('CREATE (a:Item {jsonData: $jsondata}) RETURN a', { jsonData: jsonData });

    promise.then((result) => {
        session.close();
        logger.debug(result);
        instance.close();
    });

}



function setAcceptableSearchLimit() {
    //halt processes until clock resets 
    searchLimit = 500;

}

module.exports = makeFetch;