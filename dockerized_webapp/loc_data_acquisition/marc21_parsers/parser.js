var parseTools = {};

var through = require('through2');

var leaderParser = require('./parser_Leader');
var controlParser = require('./parser_Control');
var dataParser = require('./parser_Data');

function ParseMARC(marc21) {
    var newObject = {};
    newObject = leaderParser.Parse(marc21, newObject);
    newObject = controlParser.Parse(marc21, newObject);
    newObject = dataParser.Parse(marc21, newObject);
    // append with marc of old document
    //newObject = Add(newObject, "Marc21", marc21, false);
    return newObject;
}

parseTools.parse = function (object) {
    return ParseMARC(object);
}

function TryGet(obj, field) {
    var value = "";
    try {
        value = obj[field];
    } catch (ex) {

    }
    return value;
}

function ConvertForNeo(obj) {
    var neoObject = {
        isValid: false,
        person: TryGet(obj, "author"),
        publisher: TryGet(obj, "publisher"),
        place: TryGet(obj, "publishinglocation"),
        editionISBN: TryGet(obj, "isbn"),
        editionTitle: TryGet(obj, "title"),
        editionDate: TryGet(obj, "publisheddate")
    };
    neoObject.isValid = (neoObject.person != "" 
        && neoObject.publisher != "" 
        && neoObject.place != "" 
        && neoObject.editionISBN != "" 
        && neoObject.editionTitle != "" 
        && neoObject.editionDate != "");
    return neoObject;
}

parseTools.streamParse = function () {
    return through.obj(function (object, enc, cb) {
        var obj = ParseMARC(object);
        var neoObject = ConvertForNeo(obj);
        this.push(neoObject);
        cb();
    });
}

module.exports = parseTools;