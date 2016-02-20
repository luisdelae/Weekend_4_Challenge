var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//bring in the pg module

var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/to_do_list';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



//get, post, and put requests go here



app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});