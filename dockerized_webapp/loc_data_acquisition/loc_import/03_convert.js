/**
 * Convert compressed files to JSON and extract fields of interest
 */
var fs = require('fs');
var marc4js = require('marc4js');
var parse = require('../marc21_parsers/parser');
var stringify = require('json-array-streams');

var logger = require('../utils/log');
logger.level = 4;

var downloadsDir = "../loc/";

var count = 0;

function getXMLFiles(directory) {
    let allFiles = fs.readdirSync(directory);
    let xmlFiles = [];
    for (let i = 0; i < allFiles.length; i++) {
        if (allFiles[i].endsWith('.xml')) {
            xmlFiles.push(downloadsDir + allFiles[i]);
        }
    }
    return xmlFiles;
}

var files = getXMLFiles(downloadsDir);

var items = [];
var batchSize = 100000;
var fileNumber = 0;

function ConvertFile(file, logger) {
    logger.debug("Converting " + file);
    fs.createReadStream(file)
        .pipe(marc4js.parse({ format: 'marcxml' }))
        .pipe(parse.streamParse())
        //.pipe(stringify.stringify())
        .on("data", (data) => {
            items.push(data);
            if (items.length >= batchSize) {
                fs.writeFileSync(downloadsDir + "batch" + fileNumber + ".json", JSON.stringify(items));
                fileNumber++;
                items = [];
            }
        }).on("finish", () => {
            fs.writeFileSync(downloadsDir + "batch" + fileNumber + ".json", JSON.stringify(items));
            fileNumber++;
            items = [];
        });
}

for(var i = 0; i < files.length; i++) {
    ConvertFile(files[i], logger);
}
//ConvertFile(file, logger);
