/*
 * Example script of initial execution of search queries through WorldCat Search 
 *
 */



//var server = require("./server.js");

var assert = require("assert");

const MAX_SEARCHES = 50000;
//need to continually monitor the searches being done
//Keep a 24 hour clock to monitor search limits? 

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
                var tempStorage = data;
                alert(data);
                $("#results-container").html(data);
                $("#results-container").modal('show');
            },
            error: function() {
                alert("Error: Data not retrieved correctly");
            },

            complete: function(xhr, status) {

            }
        });

    });
}

setTimeout(makeRequest, 5000);

//This method is the actual OpenSearch method represented in the WordCat Search API page
worldCatDriver.retrieveQuery = function(query) {

}

worldCatDriver.didFinishLoading = function(data) {

}

worldCatDriver.setAcceptableSearchLimits = function(numSearches) {

    //once numSearches == 0
    //halt processes until clock resets 

    //Constant for individual searches 
    //Best method of stretching the limit for now 

}

worldCatDriver.getStartPosition = function(query, startPosition) {
    //or we could just set this as a constant for now..?
}

//how many terms designates this as an advanced search?
worldCatDriver.advancedSearch = function(query, callback) {

}

worldCatDriver.updateSearch = function(query, updateQuery, callback) {

}



module.exports = worldCatDriver;