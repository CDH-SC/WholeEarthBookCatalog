var dataParser = {};

var lib = require('./parser_Lib');

var Add = lib.Add;
var LookupInTable = lib.LookupInTable;

var isNullOrUndefined = require('util').isNullOrUndefined;

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

function trimChar(text, charToRemove) {
    while (text.charAt(0) == charToRemove) {
        text = text.substring(1);
    }

    while (text.charAt(text.length - 1) == charToRemove) {
        text = text.substring(0, text.length - 1);
    }

    return text;
}

function FillOutName(name, extension) {
    extension = trimChar(extension, "(");
    extension = trimChar(extension, ",");
    extension = trimChar(extension, ")");
    name = name.split(".").join();
    name = name.replace(",", "");
    var nameParts = name.split(" ");
    var extensionParts = extension.split(" ");
    var currentPosInExtension = 0;
    for (var i = 0; i < Math.max(nameParts.length, extensionParts.length); i++) {
       if(currentPosInExtension < extensionParts.length && extensionParts[currentPosInExtension].startsWith(nameParts[i])) {
           nameParts[i] = extensionParts[currentPosInExtension];
           currentPosInExtension ++;
       }
       if(nameParts.length < i && !isNullOrUndefined(nameParts[i])) {
            nameParts[i] = nameParts[i].trim();
       }
    }
    return nameParts.join(" ");
}

function BuildAuthorName(dataField) {
    // works, but might should be modified to understand that G. Blah Blahge  with (Gerogie Blah) should be corrected as Georgie Blah Blage, not G. Blah Blageorgie
    var author = Subfield(dataField, "a");
    var title = Subfield(dataField, "c");
    var fullerName = Subfield(dataField, "q");

    var result = author;
    // Switch from Family, Name to Name Family
    if (!isNullOrUndefined(author)) {
        author = trimChar(author.trim(), ",");
        var authorNameParts = author.split(',');
        if (authorNameParts.length == 2) {
            result = authorNameParts[1].trim().replace(".", "") + " " + authorNameParts[0].trim().replace(".", "");
        } else {
            result = author.trim().replace(".", "").replace(",", "");
        }
    }

    if (!isNullOrUndefined(title)) {
        result = title.trim() + " " + result;
    }

    if (!isNullOrUndefined(fullerName)) {
        result = FillOutName(result, fullerName);
    }

    if (!isNullOrUndefined(result)) {
    result = result.replace(".", "");
    } else {
        result = author;
    }

    return result;
}

function ExtractData_Item_TitleField(obj, dataField) {
    switch (dataField._tag) {
        case "210": {
            obj = Add(obj, "title", Subfield(dataField, "a"));
            break;
        }
        case "222": {
            obj = Add(obj, "title", Subfield(dataField, "a"));
            break;
        }
        case "240": {
            obj = Add(obj, "title", Subfield(dataField, "a"));
            obj = Add(obj, "language", Subfield(dataField, "l"));
            break;
        }
        case "242": {
            obj = Add(obj, "title", Subfields(dataField, ["a", "b"]));
            obj = Add(obj, "language", Subfield(dataField, "y"));
            break;
        }
        case "243": {
            obj = Add(obj, "title", Subfield(dataField, "a"));
            obj = Add(obj, "language", Subfield(dataField, "l"));
            break;
        }
        case "245": {
            obj = Add(obj, "title", Subfields(dataField, ["a", "b"]));
            break;
        }
        case "246": {
            obj = Add(obj, "title", Subfields(dataField, ["a", "b"]));
            break;
        }
        case "247": {
            obj = Add(obj, "title", Subfields(dataField, ["a", "b"]));
            break;
        }
        default:
            break;
    }
    return obj;
}

function ExtractData_Item_Author(obj, dataField) {
    obj = Add(obj, "author", BuildAuthorName(dataField));
    obj = Add(obj, "authordates", Subfield(dataField, "d"));
    return obj;
}

function ExtractData_Item_CorporateAuthor(obj, dataField) {
    obj = Add(obj, "author", Subfields(dataField, ["a", "b"]));
    return obj;
}

function ExtractData_Numbers_And_Codes(obj, dataField) {
    switch(dataField._tag) {
        case "028": {
            obj = Add(obj, "publisher", Subfields(dataField, "b"));
            break;
        }
        case "020": {
            obj = Add(obj, "isbn", Subfields(dataField, "a"));
            break;
        }
        case "022": {
            obj = Add(obj, "issn", Subfields(dataField, "a"));
            break;
        }
        case "260": {
            obj = Add(obj, "publishinglocation", Subfield(dataField, "a"));
            obj = Add(obj, "publisher", Subfield(dataField, "b"));
            obj = Add(obj, "publisheddate", Subfield(dataField, "c"));
            break;
        }
        default: {
            break;
        }
    }
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
    if (["028", "260", "020", "022"].includes(tag))
        obj = ExtractData_Numbers_And_Codes(obj, dataField);
    return obj;
}

dataParser.Parse = function (marc21, obj) {
    var newObject = obj;
    var data = marc21._dataFields;
    for (var i = 0; i < data.length; i++) {
        var dataField = data[i];
        newObject = ExtractData_Item(newObject, dataField);
    }
    return newObject;
}

module.exports = dataParser;