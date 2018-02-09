/*
* Example script of initial execution of search queries through WorldCat Search 
*
*/



var server = require("./server.js");

var assert = require("assert");
var url = "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch?q=APIs&wskey=J4W8SNzajOA70WQBGDQ4PJwIREEFV4zPIT7cApskXcag34uGDwTb9p2hUfGJg8LOAPuEvScdeADVA4bu"

var worldCatDriver = {};

//key required, insert here
//url required, insert here 

//includes one or more of a set of terms

var makeRequest = function() {
	//retrieve url 
	//make request with that 

	//include error clauses - dont forget!!!!!

}

//This method is the actual OpenSearch method represented in the WordCat Search API page
worldCatDriver.openSearch = function(url, didFinishLoading) {

}

worldCatDriver.didFinishLoading = function(data) {

}

worldCatDriver.basicSearch = function(query, callback) {
	//include assert

}

worldCatDriver.keywordSearch = function(query, callback) {

}

//how many terms designates this as an advanced search?
worldCatDriver.advancedSearch = function(query, callback) {

}

worldCatDriver.updateSearch = function(query, updateQuery, callback) {

}



module.exports = worldCatDriver;