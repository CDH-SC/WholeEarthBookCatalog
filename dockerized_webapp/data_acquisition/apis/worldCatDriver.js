import { URL } from "jsdom/lib/jsdom/living";

/*
 
     * Example script of initial execution of search queries through WorldCat Search 
     *
     */



//var server = require("./server.js");

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




//required for jquery
var options = {
    host: 'jquery.com',
    port: 80,
    path: '/',

    downloadsDir: "data_acquisition/worldCatData",
    completionTag: ".complete"
};

var html = '';

http.get(options, function(res) {
    res.on('data', function(data) {
        html += data;

    }).on('end', function() {
        var dataContainer = $(html).find('ISBN').text();


    });

});


function loadDocs() {

    var xhttp = new XMLHttpRequest();
    // document.getElementById("demo").innerHTML = "hello";

    xhttp.onreadystatechange = function() {
        //   document.getElementById("demo2").innerHTML = "checking 2";

        // if (this.readyState == 4 && this.status == 200) {
        // if (xhttp.readyState == XMLHttpRequest.DONE) {
        alert(xhttp.responseText);

        document.getElementById("demo").innerHTML = "DONE";

        //} 

    }

    xhttp.open("GET", "http://worldcat.org/webservices/catalog/search/worldcat/opensearch?q=robert%20sheckley&format=atom&start=3&count=10&cformat=mla&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu", true);
    //  xhttp.open("GET", "alert successful", true);
    console.log(xhttp.responseText);
    xhttp.send();




}

/*


var makeRequest = function() {
    $(document).ready(function() {
        $.ajax({
            // url: "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=" + retrieveQuery(query) + "&format=atom&start=" + getStartPosition(query, startPosition) + "&count=" + setAcceptableSearchLimit() + "&cformat=mla&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu",
            url: "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=robert%20sheckley&format=atom&start=3&count=10&cformat=mla&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu",
            type: 'GET',
            dataType: 'xml',
            ifModified: false,
            processData: false,
            success: function(data) {
                var itemURL = URL.createObjectURL(data);
                var $a = $('<a/>', {
                    'href': url,
                    'text': click,
                }).hide().appendTo("body")[0].click();


                importIntoNeo4j(logger);

                //possible strategy for downloading 
            },
            error: function() {
                alert("Error: Data not retrieved correctly");
            },

            complete: function(xhr, status) {

            }
        });

    });
}
*/
setTimeout(makeRequest, 5000);

function makeFetch(query, startPosition, searchLimit) {
    var retrieveQuery = function(query) {
        limit = setAcceptableSearchLimits();
        pos = getStartPosition();
        fetchQuery = retrieveQuery();
    }
    var urlFetch = "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=" + retrieveQuery() + "&format=atom&start=" + pos + "&count=" + limit + "&cformat=mla&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu",
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