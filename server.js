// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.json());       // to support JSON-encoded bodies

// init sqlite db
var fs = require('fs');
var dbFile = './.data/comment.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);



// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Comments (id INTEGER UNIQUE, name TEXT, rating INTEGER, comment TEXT)');
    console.log('New table Comments created!');
  }
  else {
    console.log('Database "Comments" ready to go!');
    db.each('SELECT * from Comments', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
    db.run("DELETE FROM Comments WHERE id = 1534117357131");
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/commands', function(request, response) {
  response.sendFile(__dirname + '/views/commands.html');
});

app.get('/google324cb0babcc9aa76.html', function(request, response) {
  response.sendFile(__dirname + '/google324cb0babcc9aa76.html');
});

app.get('/sitemap.txt', function(request, response) {
  response.sendFile(__dirname + '/sitemap.txt');
});


// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getComments', function(request, response) {
  db.all('SELECT * from Comments', function(err, rows) {
    response.send(JSON.stringify(rows));
    console.log("sent");
  });
});

let upload = new multer();

app.post('/', upload.fields([]), function(req, res) {
  console.log(req.body);
  db.run("INSERT INTO Comments(id, name, rating, comment) VALUES (?, ?, ?, ?)", [Date.now(), req.body.name, req.body.rating, req.body.comment], function(err) {
    if (err) {
      console.error(err);
    }
  });
  res.sendFile(__dirname + '/views/index.html');
});

//console.log(vals);
//db.run(`INSERT INTO Comments(name, rating, comment) VALUES (?, ?, ?)`, vals);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
