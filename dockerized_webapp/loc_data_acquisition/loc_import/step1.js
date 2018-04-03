/**
 * Download compressed files
 */

var request = require("sync-request");
var fs = require("fs");
var http = require("http");
var logger = require("../utils/log");
var marc4js = require('marc4js');
var parse = require('../marc21_parsers/parser');
var stringify = require('json-array-streams');

logger.level = 4;

var sourceURL = "http://www.loc.gov/cds/products/MDSConnect-books_all.html";
var sourceFormat = /\/cds\/downloads\/MDSConnect\/BooksAll\.\d{0,4}\.part.{0,2}\.xml\.gz/g;
var sourceRequestFormat = "http://www.loc.gov";
var downloadsDir = "../loc/";

function getAllFiles(dir) {
    return fs.readdirSync(dir);
}

function getHttp(url) {
    return request('GET', url, { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36' });
}

let catalog = getHttp(sourceURL).getBody('utf8');
let matches = catalog.match(sourceFormat)
let listOfFiles = null

if (matches != null) {
    listOfFiles = matches.map((e) => sourceRequestFormat + e);
} else {
    logger.error("failed to get catalog, falling back to cached files");
    listOfFiles = getAllFiles(downloadsDir);
}

if(!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

let currentFiles = getAllFiles(downloadsDir);
let missingFiles = [];

for (let i = 0; i < listOfFiles.length; i++) {
    let file = listOfFiles[i];
    let partNumber = file.match(/part\d\d/)[0];
    let match = null;

    for (let j = 0; j < currentFiles.length; j++) {
        if (currentFiles[j].match(partNumber) != null) {
            match = currentFiles[j];
            j = currentFiles.length;
        }
    }

    if (match == null) {
        console.log("queueing file for download: " + file);
        let fileName = downloadsDir + partNumber + ".xml.gz";
        missingFiles.push({
            url: file, 
            file: fileName
        });
    }
}

var items = [];
var batch = 0;
var batchSize = 100000;
var fileNumber = 0;

for(var i = 0; i < missingFiles.length; i++) {
    let file = missingFiles[i];
    console.log("downloading: " + file.url + " to " + file.file);
    http.get(file.url, (response) => {
        response.pipe(fs.createWriteStream(file.file)).on('finish', () => {
            console.log("file downloaded: " + file.file);
            var extractedFile = file.file.slice(0, -3);
            console.log("extract file: " + file.file + " into " + extractedFile);
            var gzFile = require('gunzip-file');
            gzFile(file.file, extractedFile, () => {
                console.log("file extracted: " + extractedFile);
                fs.unlinkSync(file.file);
                console.log("convert file: " + extractedFile);
                fs.createReadStream(extractedFile)
                    .pipe(marc4js.parse({ format: 'marcxml' }))
                    .pipe(parse.streamParse())
                    .on("data", (data) => {
                        items.push(data);
                        if (items.length >= batchSize) {
                            let tmpItems = items;
                            items = [];
                            fs.writeFileSync(downloadsDir + "batch" + fileNumber + ".json", JSON.stringify(tmpItems));
                            fileNumber++;
                        }
                    }).on("finish", () => {
                        console.log("file converted: " + extractedFile);
                        fs.unlinkSync(extractedFile);
                        let tmpItems = items;
                        items = [];
                        fs.writeFileSync(downloadsDir + "batch" + fileNumber + ".json", JSON.stringify(tmpItems));
                        fileNumber++;
                    });
            });
        });
    });
}

// http.get(file, (response) => {
//     response.pipe(fs.createWriteStream(fileName));
// });
