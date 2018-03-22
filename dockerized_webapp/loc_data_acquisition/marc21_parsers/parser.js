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

parseTools.streamParse = function () {
    return through.obj(function (object, enc, cb) {
        var obj = ParseMARC(object);
        this.push(obj);
        cb();
    });
}

module.exports = parseTools;