/**
 * Extract compressed files
 */

var fs = require('fs');

var logger = require('../../utils/log');
logger.level = 4;

var downloadsDir = "data_acquisition/loc/";

function getAllGzFiles(directory) {
    let allFiles = fs.readdirSync(directory);
    let gzFiles = [];
    for(let i = 0; i < allFiles.length; i++) {
        if(allFiles[i].endsWith('.gz')) {
            gzFiles.push(directory + allFiles[i]);
        }
    }
    return gzFiles;
}

function extractFiles(files, i, logger) {
    var file = files[i];
    if (i < files.length && file.endsWith("gz") && !fs.existsSync(file.slice(0, -3))) {
        // if gz
        var extractedFile = file.slice(0, -3);
        logger.debug("extract file: " + file + " into " + extractedFile);
        var gzFile = require('gunzip-file');
        gzFile(file, extractedFile, () => {
            extractFiles(files, i + 1, logger);
        });
    } else if (i < files.length) {
        // if not gz, but also, not out of files
        extractFiles(files, i + 1, logger);
    }
}

var files = getAllGzFiles(downloadsDir);

extractFiles(files, 0, logger);