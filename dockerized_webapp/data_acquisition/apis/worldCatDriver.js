/*
 
     * Example script of initial execution of search queries through WorldCat Search 
     *
     */

var assert = require("assert");
var http = require("http");
var neo4j = require("neo4j-driver").v1;
var exdefs = require("../exdefs");
var fs = require("fs");
var request = require('sync-request');

var jsdom = require("jsdom");
var $ = require('jquery')(jsdom.jsdom().parentWindow);
var query = null;
var startPosition = 0;
var searchLimit = 0;


const MAX_SEARCHES = 50000;
//need to continually monitor the searches being done



setTimeout(makeFetch, 5000);

function makeFetch() {
    var retrieveQuery = function(query) {
            //   limit = setAcceptableSearchLimits();
            // pos = getStartPosition();
            // fetchQuery = retrieveQuery();
        }
        // var urlFetch = "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=" + retrieveQuery() + "&format=atom&start=" + pos + "&count=" + limit + "&cformat=mla&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu",
    var urlFetch = "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=Robert%20Sheckley&format=atom&start=4&count=20&cformat=mla&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu",
        var importIntoNeo4j = function(logger) {
            var req = new Request(urlFetch, { method: 'GET', cache: 'default' });

            fetch(req).then(function(response) {
                if (response.ok) {
                    return response.text();
                }
                return response.error();
            });


        }

    var didFinishLoading = function(data) {

    }

    function setAcceptableSearchLimit() {
        //halt processes until clock resets 
        searchLimit = 500;
        //Best method of stretching the limit for now 

    }

    module.exports = makeFetch;