var express = require('express');
var pixi = require('pixi');
var app = express();

app.use(express.static('testCaseAssets'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/music.html');
})

app.listen(3000, function() {
    console.log('MusicGroup app listening on port 3000!')
})