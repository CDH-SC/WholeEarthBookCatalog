var controlParser = {};

var lib = require('./parser_Lib');

var Add = lib.Add;
var LookupInTable = lib.LookupInTable;

function ExtractControl_FixedLengthData(controlField, obj) {
    var data = controlField._data;
    obj = Add(obj, "language", data.substring(35, 37));
    //obj = Add(obj, "publishinglocation", data.substring(15, 17));
    return obj;
}

function ExtractControl_FixedLengthDataAdditionalCharacteristics(controlField, obj) {
    var data = controlField._data;

    return obj;
}

function ExtractControl_FixedLengthPhysicalDescription(controlField, obj) {
    var data = controlField._data;

    return obj;
}

controlParser.Parse = function(marc21, obj) {
    var control = marc21._controlFields;
    for (var i = 0; i < control.length; i++) {
        var controlField = control[i];
        switch (controlField._tag) {
            case "001":
                obj = Add(obj, "controlnumber", controlField._data);
                break;
            case "003":
                obj = Add(obj, "controlnumberidentifier", controlField._data);
                break;
            case "005":
                //obj = Add(obj, "lasttransaction", controlField._data);
                break;
            case "006":
                obj = ExtractControl_FixedLengthDataAdditionalCharacteristics(controlField, obj);
                // obj = Add(obj, "ControlFixedLengthDataAdditionalCharacteristics", controlField._data, false);
                break;
            case "007":
                obj = ExtractControl_FixedLengthPhysicalDescription(controlField, obj);
                // obj = Add(obj, "ControlFixedLengthPhysicalDescription", controlField._data, false);
                break;
            case "008":
                ExtractControl_FixedLengthData(controlField, obj);
                // obj = Add(obj, "ControlFixedLengthData", controlField._data, false);
                break;
            default:
                break;
        }
    }
    return obj;
}

module.exports = controlParser;