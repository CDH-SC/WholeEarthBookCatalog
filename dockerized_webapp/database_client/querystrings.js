/**
 * Preconstructed query strings for different types of neo4j queries
 */

"use strict";

// module
var qstrings = {};

/**
 * Params: 
 *   - type
 *   - substring
 *   - limit
 *
 */    
qstrings.simpleKeywordSearch = "MATCH (n:AttributeValue) WHERE n.Type = { type } AND n.Value CONTAINS { substring } RETURN DISTINCT n LIMIT { limit }";

module.exports = qstrings;
