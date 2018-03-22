/**
 * Download compressed files
 */

var request = require("sync-request");
var fs = require("fs");
var http = require("http");
var logger = require("../utils/log");
logger.level = 4;

var sourceURL = "http://www.loc.gov/cds/products/MDSConnect-books_all.html";
var sourceFormat = /\/cds\/downloads\/MDSConnect\/BooksAll\.\d{0,4}\.part.{0,2}\.xml\.gz/g;
var sourceRequestFormat = "http://www.loc.gov";
var downloadsDir = "data_acquisition/loc/";

function getAllFiles(dir) {
    return fs.readdirSync(dir);
}

function getHttp(url) {
    return request('GET', url, { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36' });
}

// mkdir if not exist
try {
    if (fs.existsSync(downloadsDir).valueOf() == false)
        fs.mkdirSync(downloadsDir);
} catch (ex) { 
    console.log(JSON.stringify(ex, null, 2));
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
        logger.debug("queueing file for download: " + file);
        let fileName = downloadsDir + partNumber + ".xml.gz";
        missingFiles.push({
            url: file, 
            file: fileName
        });
    }
}

function downloadFiles(files, i, logger) {
    if (i < files.length) {
        let file = files[i];
        logger.debug("downloading: " + file.url + " to " + file.file);
        http.get(file.url, (response) => {
            response.pipe(fs.createWriteStream(file.file)).on('finish', () => {
                logger.debug("file downloaded: " + file.file);
                downloadFiles(files, i + 1, logger);
            });
        });
    }
}

downloadFiles(missingFiles, 0, logger);

// http.get(file, (response) => {
//     response.pipe(fs.createWriteStream(fileName));
// });
