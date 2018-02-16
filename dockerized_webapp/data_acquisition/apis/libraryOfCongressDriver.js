var request = require("sync-request");
var fs = require("fs");
var http = require("http");
var marc4js = require("marc4js");
var exdefs = require("../exdefs");
var neo4j = require("neo4j-driver").v1;


var options = {
    sourceURL: "http://www.loc.gov/cds/products/MDSConnect-books_all.html",
    // https://catalog.data.gov/dataset/books-all // fallback url
    sourceFormat: /\/cds\/downloads\/MDSConnect\/BooksAll\.\d{0,4}\.part.{0,2}\.xml\.gz/g,
    sourceRequestFormat: "http://www.loc.gov",

    compressedFileFormat: "BooksAll\.\d{0,4}\.part.{0,2}\.xml\.gz",
    decompressedFileFormat: "part{0}.xml",

    downloadsDir: "data_acquisition/loc/",
    completionTag: ".complete"
};

function getAllFiles(dir) {
    return fs.readdirSync(dir);
}

function getHttp(url) {
    return request('GET', url, { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36' });
}

function importFiles(logger) {
    try {
        if (fs.existsSync(options.downloadsDir).valueOf() == false)
            fs.mkdirSync(options.downloadsDir);
    } catch (ex) { /*swallow*/ }
    // request catalog of files
    let catalog = getHttp(options.sourceURL).getBody('utf8');
    let matches = catalog.match(options.sourceFormat)
    let listOfFiles = null
    if (matches != null) {
        listOfFiles = matches.map((e) => options.sourceRequestFormat + e);
    } else {
        logger.error("failed to get catalog, falling back to cached files");
        listOfFiles = getAllFiles(options.downloadsDir);
    }
    // compare part numbers to files in the downloads dir
    let currentFiles = getAllFiles(options.downloadsDir);
    // download files we don't have, either compressed or decompressed
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
        if (match != null) {
            let fileName = options.downloadsDir + match;
            // file exists
            if (match.endsWith("gz")) {
                extractFile(fileName, logger);
            } else if (match.endsWith("xml")) {
                convertFile(fileName, logger);
            } else if (match.endsWith(options.completionTag)) {
                // nothing, it's in there already
            } else {
                // I will ignore it, for now
            }
        } else {
            logger.debug("download file: " + file);
            // file doesn't exist
            let fileName = options.downloadsDir + partNumber + ".xml.gz";

            let downloadFile = fs.createWriteStream(fileName);

            let downloadRequest = http.get(file, function(response) {
                response.pipe(downloadFile).on('finish', () => { extractFile(fileName, logger); });
            });
        }
    }
}

function extractFile(file, logger) {
    // extract all files in the downloads dir
    // delete compressed files
    logger.debug("extract file: " + file);
    let extractedFile = file.slice(0, -3);
    let gzFile = require('gunzip-file');

    gzFile(file, extractedFile, () => {
        fs.unlinkSync(file); // delete the old file
        convertFile(extractedFile, logger);
    });
}

function convertFile(file, logger) {
    logger.debug("convert file: " + file);
    let convertedFile = file.slice(0, -4) + ".json";

    let replace = require('stream-replace');
    let parser = marc4js.parse({ format: 'marcxml' });
    let transformer = marc4js.transform({ format: "json" });
    fs.createReadStream(file)
        .pipe(parser)
        //.pipe(transformer)
        .on('data', (record) => {
            importRecord(record, logger);
        });
}

function importRecord(marc21, logger) {
    let record = {
        marc21: marc21,
        exdefs: [

        ]
    };
    let driver = neo4j.driver("bolt://localhost:7687");
    let session = driver.session();

    // MUTEX ABOVE, somewhere

    // wait for session
    // then run
    // then hold stream until promise resolves?
    // maybe push all objects into a sub folder then take them synchronously later......
    let resultPromise = session.run('CREATE (a:Item {marc21: $marc}) RETURN a', { marc: JSON.stringify(marc21) });;

    resultPromise.then((result) => {
        session.close();
        logger.debug(result);
        driver.close();
    });
    // rename file to add completion tag
    // for server, maybe clear file too
}

module.exports = importFiles;