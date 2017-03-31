"use strict";

var PORT = 9595;

var fs = require('fs');
var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var team = require('./src/resource/team');

var db = new sqlite3.Database('nfl-data.sqlite3', function(err) {
  if(err) console.error(err);
});

var router = new (require('./lib/route')).Router(db);

router.get('/', function(req, res) {
  fs.readFile('public/index.html', function(err, body){
    if(err){console.log(err);}
    res.setHeader('Content-Type', 'text/html');
    res.end(body);
  });
});

router.post('/', function(req, res){
    team.create(req, res, db);
    fs.readFile('public/index.html', function(err, body){
    if(err){console.log(err);}
        res.setHeader('Content-Type', 'text/html');
        res.end(body);
    }); 
});

router.get('/app.js', function(req, res) {
  fs.readFile('public/app.js', function(err, body){
    res.end(body);
  });
});

router.get('/public/team-form.html', function(req, res) {
  fs.readFile('public/team-form.html', function(err, body){
    res.setHeader('Content-Type', 'text/html');
    res.end(body);
  });
});

router.get('/public/styles/index.css', function(req, res) {
  fs.readFile('public/styles/index.css', function(err, body){
    res.setHeader('Content-Type', 'text/css');
    res.end(body);
  });
});

router.get('/public/images/:filename',function(req, res){
    fs.readFile('public/images/' + req.params.filename, function(err, body){
      res.setHeader('Content-Type', 'image/*');
      res.end(body);
    });
});


var team = require('./src/resource/team');
router.resource('/teams', team);

var migrate = require('./lib/migrate');
migrate(db, 'migrations', function(err){

  var server = new http.Server(function(req, res) {
     router.route(req, res);
  });
  server.listen(PORT, function(){
      console.log("listening on port " + PORT);
  });


});
