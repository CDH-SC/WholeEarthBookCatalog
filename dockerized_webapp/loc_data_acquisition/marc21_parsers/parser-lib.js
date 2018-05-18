var lib = {};

var isNullOrUndefined = require('util').isNullOrUndefined;

lib.LookupInTable = function(table, code) {
    code = code.trim();
    if (!isNullOrUndefined(table[code])) {
        return table[code];
    }
    return null;
}

lib.Add = function(obj, field, value, trim = true) {
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

module.exports = lib;
