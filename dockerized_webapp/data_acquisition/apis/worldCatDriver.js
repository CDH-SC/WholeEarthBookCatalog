/*
* Example script of initial execution of search queries through WorldCat Search 
*
*/



//var server = require("./server.js");

var assert = require("assert");

var worldCatDriver = {};

//key required, insert here
//url required, insert here 

//includes one or more of a set of terms

var makeRequest = function() {
	//retrieve url 
	//make request with that 

	//include error clauses - dont forget!!!!!

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