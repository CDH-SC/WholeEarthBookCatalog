/**
 * exdefs.js
 * -----------------------------------------------------------------------------
 * all extraction definitions currently in use
 * 
 * -----------------------------------------------------------------------------
 * extraction definitions
 * -----------------------------------------------------------------------------
 * exdefName: the name for use in rolling back extractions and identifiying already applied exdefs, must be unique
 * fieldName: the name of the field to create to hold this new field
 * nodeName: the name of the node type to create to group items with this field
 * extractor: a function that takes an item and returns the value of a field from the raw data
 * 
 * -----------------------------------------------------------------------------
 * item definition
 * -----------------------------------------------------------------------------
 * id: the database id
 * fields: [ the fields connected to this item
 *  {
 *      name: the fieldName
 *      value: the value of the field for this item
 *      exdefSource: the exdefName that produced this field
 *  }
 * ]
 * raw: the raw marc21, in json format, for use in calculating the fields and nodes
 * 
 * -----------------------------------------------------------------------------
 * node definition
 * -----------------------------------------------------------------------------
 * nodes are of type nodeName
 * id: the database id
 * value: the value of the node
 * exdefSource: the exdefName that produced the field
 */

module.exports = [
    {
        exdefName: "e_author",
        fieldName: "Author", 
        nodeName: "Author",
        extractor: function(item) {
            return "William Shakespeare";
        }
    }, 

    {
    	exdefNAme: "e_genre", 
    	fieldName: "Genre", 
    	nodeName: "Genre", 
    	extractor: function(item) {
    		//retrieve substring
    		return "Historical Fiction";
    	}

    },

    {

    	exdefNAme: "e_title", 
    	fieldName: "Title", 
    	nodeName: "Title", 
    	extractor: function(item) {
    		//retrieve substring
    		return "The Great Gatsby";


    }, 

    {

    	exdefNAme: "e_publisher", 
    	fieldName: "Publisher", 
    	nodeName: "Publisher", 
    	extractor: function(item) {
    		//retrieve substring
    		return "Random House";

    }
];



