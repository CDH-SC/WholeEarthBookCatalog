// Basic server functionality

// Import express (will need in the future for created api endpoints)
var express = require('express');

// Import Neo4j node module
var noe4j = require('neo4j');

var app = express();
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile("index.html", {root: '.'});
})

// Basic listening on localhost
app.listen(4000, function() {
    console.log('Listening on 4000');
})