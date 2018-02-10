/*
 * Example script of initial execution of search queries through WorldCat Search 
 *
 */



var server = require("./server.js");

var assert = require("assert");

const MAX_SEARCHES = 50000;
//need to continually monitor the searches being done

//Possibility: continually keep a 24-hour clock running (on Eastern Standard Time)

var makeRequest = function() {
    $(document).ready(function() {
        $.ajax({
            url: "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=APIs&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu",
            type: 'GET',
            dataType: 'xml',
            data: { "q=": queryString, "&format=": format, "&start=": startPosition, "&count=": count },
            ifModified: false,
            processData: false,
            success: function(data) {
                $("#results-container").html(data);
                $("#results-container").modal('show');
            },
            error: function() {
                alert("error");
            },

            complete: function(xhr, status) {

            }
        });

    });
}

setTimeout(makeRequest, 5000);

//This method is the actual OpenSearch method represented in the WordCat Search API page
worldCatDriver.openSearch = function(url, didFinishLoading) {

}

worldCatDriver.didFinishLoading = function(data) {

}

worldCatDriver.monitorNumSearches = function(numSearches) {

    //once numSearches == 0
    //halt processes until clock resets 

    //Constant for individual searches 
    //Best method of stretching the limit for now 

}

worldCatDriver.keywordSearch = function(query, callback) {

}

//how many terms designates this as an advanced search?
worldCatDriver.advancedSearch = function(query, callback) {

}

worldCatDriver.updateSearch = function(query, updateQuery, callback) {

}



module.exports = worldCatDriver;