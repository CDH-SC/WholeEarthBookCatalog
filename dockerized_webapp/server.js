/**
 * An express server to serve as an API for the web app
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var driver = require("./database_client/driver.js");
var port = process.env.PORT;
var router = express.Router();

// get data from the database
router.get('/get_data/:list_name', function(req, res) {
    var lname = req.params.list_name; // query db for this list

    driver.findDocument({"name": lname}, function(resp) {
        if (resp.length > 0) {
            console.log(resp[0]);
            res.json(resp);
        } else {
            res.json({"Error": `No list found with name: ${lname}`})
        }
    });
});

// post data to the database
router.post('/post_data/', function(req, res) {
    var data = req.body;
    console.log(req.body);

    // error handle
    if (data.name === undefined) {
        res.json({"Error": "invalid data format"});
    }
    else {
        // add to db
        driver.insertDocument(data, function(resp) {
            res.json(resp);
        });
    }
})

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// all endpoints are prepended with '/api'
app.use('/api', router);

// add directories with the files we need
app.use(express.static("public"));
app.use(express.static("style"));
app.use(express.static("scripts"));

// Start the server instance
app.listen(port);
console.log(`Server is listening on port ${port}`);
console.log(`Neo4j password is ${process.env.NEO4J_PASSWORD}`);
