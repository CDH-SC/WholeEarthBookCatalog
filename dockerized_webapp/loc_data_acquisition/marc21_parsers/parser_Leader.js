var leaderParser = {};

var lib = require('./parser_Lib');

var Add = lib.Add;
var LookupInTable = lib.LookupInTable;

function ExtractLeader_RecordStatusCode(code) {
    return LookupInTable({
        "a": "Encoding Level Increased",
        "c": "Corrected or Revised",
        "d": "Deleted",
        "n": "New",
        "p": "Encoding Level Increased from Prepublication"
    }, code);
}

function ExtractLeader_TypeOfRecord(code) {
    return LookupInTable({
        "a": ["Language Material", "Book"],
        "c": ["Notated Music", "Music"],
        "d": ["Manuscript Notated Music", "Music"],
        "e": ["Cartographic Material", "Map"],
        "f": ["Manuscript Cartographic Material", "Map"],
        "g": ["Projected Medium", "Media"],
        "i": ["Nonmusical Sound Recording", "Media"],
        "j": ["Musical Sound Recording", "Music"],
        "k": ["Two-Dimensional Nonprojectable Graphic", "Media"],
        "m": ["Computer File", "Media"],
        "o": ["Kit", "Media"],
        "p": ["Mixed Materials", "Media"],
        "r": ["Three-Dimensional Artifact or Naturally Occurring Object", "Media"],
        "t": ["Manuscript Language Material", "Book"],
    }, code);
}

leaderParser.Parse = function (marc21, obj) {
    var leader = marc21._leader;
    //obj = Add(obj, "recordstatus", ExtractLeader_RecordStatusCode(leader._recordStatus));
    var type = ExtractLeader_TypeOfRecord(leader._typeOfRecord);
    obj = Add(obj, "recordtype", type[0]);
    obj = Add(obj, "type", type[1]);
    return obj;
}

module.exports = leaderParser;