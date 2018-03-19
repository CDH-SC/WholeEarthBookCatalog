/**
 *
 * Unit tests
 * 
 */

"use strict";

// imports
var qstrings = require( "../utils/querystrings" );
var assert = require( "assert" );

// querystrings module
describe( "qstrings", function() {

    // check for simpleKeywordSearch string
    describe( "simpleKeywordSearch", function() {
        it( "Should return true if this string exists", function() {
        const exists = ( qstrings.simpleKeywordSearch !== null );
	    assert.equal( exists, true );
	});
    });

    // check for keywordSearch string
    describe( "keywordSearch", function() {
	it( "Should return true if this string exists", function() {
            const exists = ( qstrings.keywordSearch !== null );
	    assert.equal( exists, true );
	});
    });
});
