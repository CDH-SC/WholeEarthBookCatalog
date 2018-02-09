/*
 * Example script of initial execution of search queries through WorldCat Search 
 *
 */



var server = require("./server.js");

var assert = require("assert");

const MAX_SEARCHES = 50000;
//need to continually monitor the searches being done

//deduct them from this number
var numSearches = MAX_SEARCHES;

//Possibility: continually keep a 24-hour clock running (on Eastern Standard Time)

var url = "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=APIs&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu";

var urlComplete = "http://worldcat.org/webservices/catalog/search/opensearch?q=[query]&format=[atom|rss]&start=[stiart position]&count=500&cformat=mla&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu";


var worldCatDriver = {};


var makeRequest = function() {
    //retrieve url 
    //make request with that 

    //include error clauses 

}

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