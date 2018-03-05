var isNullOrUndefined = require('util').isNullOrUndefined;
var through = require('through2');

//#region GenericFunctions
function LookupInTable(table, code) {
    code = code.trim();
    if (!isNullOrUndefined(table[code])) {
        return table[code];
    }
    return null;
}

function Add(obj, field, value, trim = true) {
    if (value != null) {
        var fieldValue = obj[field];
        if (trim) {
            value = value.trim();
        }
        if (Array.isArray(fieldValue)) {
            fieldValue.push(value)
        }
        else {
            if (fieldValue != null) {
                fieldValue = [fieldValue];
                fieldValue.push(value);
            }
            else {
                fieldValue = value;
            }
        }
        obj[field] = fieldValue;
    }
    return obj;
}
//#endregion GenricFunctions

//#region ExtractLeader
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

function ExtractLeader(marc21, obj) {
    var leader = marc21._leader;
    obj = Add(obj, "RecordStatus", ExtractLeader_RecordStatusCode(leader._recordStatus));
    var type = ExtractLeader_TypeOfRecord(leader._typeOfRecord);
    obj = Add(obj, "RecordType", type[0]);
    obj = Add(obj, "Type", type[1]);
    return obj;
}
//#endregion

//#region ExtractControl 
function ExtractControl_FixedLengthData(controlField, obj) {
    var data = controlField._data;
    obj = Add(obj, "Language", data.substring(35, 37));
    obj = Add(obj, "PublishingLocation", data.substring(15, 17));
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

function ExtractControl(marc21, obj) {
    var control = marc21._controlFields;
    for (var i = 0; i < control.length; i++) {
        var controlField = control[i];
        switch (controlField._tag) {
            case "001":
                obj = Add(obj, "ControlNumber", controlField._data);
                break;
            case "003":
                obj = Add(obj, "ControlNumberIdentifier", controlField._data);
                break;
            case "005":
                obj = Add(obj, "LastTransaction", controlField._data);
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
//#endregion ExtractControl

//#region ExtractData
function Subfield(dataField, subfieldCode) {
    for (var i = 0; i < dataField._subfields.length; i++) {
        var subfieldValue = dataField._subfields[i];
        if (subfieldValue._code == subfieldCode)
            return subfieldValue._data;
    }
    return null;
}

function Subfields(dataField, subfieldCodes) {
    var value = ""
    for (var j = 0; j < subfieldCodes.length; j++) {
        var subfieldCode = subfieldCodes[j];
        for (var i = 0; i < dataField._subfields.length; i++) {
            var subfieldValue = dataField._subfields[i];
            if (subfieldValue._code == subfieldCode)
                value += subfieldValue._data;
        }
        if (value.trim() != "") {
            value += " ";
        }
    }
    if (value.trim() == "")
        value = null;
    return value;
}

function ExtractData_Item_TitleField(obj, dataField) {
    switch (dataField._tag) {
        case "210": {
            obj = Add(obj, "Title", Subfield(dataField, "a"));
            break;
        }
        case "222": {
            obj = Add(obj, "Title", Subfield(dataField, "a"));
            break;
        }
        case "240": {
            obj = Add(obj, "Title", Subfield(dataField, "a"));
            obj = Add(obj, "Language", Subfield(dataField, "l"));
            obj = Add(obj, "Subheading", Subfield(dataField, "k"));
            break;
        }
        case "242": {
            obj = Add(obj, "Title", Subfields(dataField, ["a", "b"]));
            obj = Add(obj, "Language", Subfield(dataField, "y"));
            break;
        }
        case "243": {
            obj = Add(obj, "Title", Subfield(dataField, "a"));
            obj = Add(obj, "Language", Subfield(dataField, "l"));
            break;
        }
        case "245": {
            obj = Add(obj, "Title", Subfields(dataField, ["a", "b"]));
            break;
        }
        case "246": {
            obj = Add(obj, "Title", Subfields(dataField, ["a", "b"]));
            break;
        }
        case "247": {
            obj = Add(obj, "Title", Subfields(dataField, ["a", "b"]));
            break;
        }
        default:
            break;
    }
    return obj;
}

function ExtractData_Item_Author(obj, dataField) {
    obj = Add(obj, "Author", Subfield(dataField, "a"));
    obj = Add(obj, "AuthorTitle", Subfield(dataField, "c"));
    obj = Add(obj, "AuthorFullerName", Subfield(dataField, "q"));
    obj = Add(obj, "AuthorDates", Subfield(dataField, "d"));
    return obj;
}

function ExtractData_Item_CorporateAuthor(obj, dataField) {
    obj = Add(obj, "Author", Subfields(dataField, ["a", "b"]));
    obj = Add(obj, "LocationOfMeeting", Subfield(dataField, "c"));
    obj = Add(obj, "DateOfMeeting", Subfield(dataField, "d"));
    return obj;
}

function ExtractData_Item(obj, dataField) {
    var tag = dataField._tag;
    if (["210", "222", "240", "242", "243", "245", "246", "247"].includes(tag))
        obj = ExtractData_Item_TitleField(obj, dataField);
    if (["100"].includes(tag))
        obj = ExtractData_Item_Author(obj, dataField);
    if (["110", "111", "130"].includes(tag))
        obj = ExtractData_Item_CorporateAuthor(obj, dataField);
    return obj;
}

function ExtractData(marc21, obj) {
    var newObject = obj;
    var data = marc21._dataFields;
    for (var i = 0; i < data.length; i++) {
        var dataField = data[i];
        newObject = ExtractData_Item(newObject, dataField);
    }
    return newObject;
}
//#endRegion ExtractData

function MassageMarc(marc21) {
    var newObject = {};
    newObject = ExtractLeader(marc21, newObject);
    newObject = ExtractControl(marc21, newObject);
    newObject = ExtractData(marc21, newObject);
    //newObject = Add(newObject, "Marc21", marc21, false);
    return newObject;
}

function CreateScript(obj) {
    var script = "CREATE (a:Item {";
    var propertyStatements = [];
    for (var propertyName in obj) {
        propertyStatements.push(propertyName + ": $" + propertyName);
    }
    script += propertyStatements.join(", ");
    script += "}) RETURN a";
    return script;
}

module.exports = () => through.obj(function (object, enc, cb) {
    var obj = MassageMarc(object);
    var script = CreateScript(obj);
    var item = {
        "script": script,
        "params": obj
    };
    this.push(item);
    cb();
});