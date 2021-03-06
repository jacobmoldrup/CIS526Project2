"use strict";
var multipart = require('./../../lib/multipart');
var fs = require('fs');

/** @module team
 * A RESTful resource representing team
 * implementing the CRUD methods.
 */
module.exports = {
  list: list,
  create: create,
  read: read,
  update: update,
  destroy: destroy
}

/** @function list
 * Sends a list of all teams as a JSON array.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function list(req, res, db) {
  db.all("SELECT * FROM teams", [], function(err, teams){
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error")
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(teams));
  });
}

/** @function create
 * Creates a new team and adds it to the database.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function create(req, res, db) {
  multipart(req, res, function(){
    var team ={
      name:req.body.name.toString(),
      coach:req.body.coach.toString(),
      description:req.body.description.toString(),
      record:req.body.record.toString(),
      imagePath: req.body.image.filename.toString()
    };
    db.run("INSERT INTO teams (name, description, record, image, coach) VALUES (?,?,?,?,?)",
    [team.name, team.description, team.record, '/public/images/' + team.imagePath , team.coach],
      function(err) {
          if(err) {
            console.error(err);
            res.statusCode = 500;
            res.end("Could not insert team into database");
            return;
          }
          res.statusCode = 200;
          res.end();
        }
      );
      uploadImage(req, res);

  });

  
}

/** @function uploadImage
 * A function to process an http POST request
 * containing an image to add to the gallery.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 */
function uploadImage(req, res) { 
  fs.writeFile('public/images/' + req.body.image.filename, req.body.image.data, function(err){
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = "Server Error";
      res.end("Server Error");
      return;
    }
  });
}

/** @function read
 * Serves a specific team as a JSON string
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function read(req, res, db) {
  var id = req.params.id;
  db.get("SELECT * FROM teams WHERE id=?", [id], function(err, team){
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
      return;
    }
    if(!team) {
      res.statusCode = 404;
      res.end("team not found");
      return;
    }
    res.setHeader("Content-Type", "text/json");
    res.end(JSON.stringify(team));
  });
}


/** @update
 * Updates a specific record with the supplied values
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function update(req, res, db) {
  var id = req.params.id;
  var body = "";

  req.on("error", function(err){
    console.error(err);
    res.statusCode = 500;
    res.end("Server error");
  });

  req.on("data", function(data){
    body += data;
  });

  req.on("end", function() {
    var team = JSON.parse(body);
    db.run("UPDATE teams SET name=?, description=?, record=?, image=?, coach=? WHERE id=?",
      [team.name, team.description, team.record, team.image, team.coach, id],
      function(err) {
        if(err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Could not update team in database");
          return;
        }
        res.statusCode = 200;
        res.end();
      }
    );
  });
}

/** @destroy
 * Removes the specified team from the database.
 * @param {http.incomingRequest} req - the request object 
 * @param {http.serverResponse} res - the response object
 * @param {sqlite3.Database} db - the database object
 */
function destroy(req, res, db) {
  var id = req.params.id;
  db.run("DELETE FROM teams WHERE id=?", [id], function(err) {
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server error");
    }
    res.statusCode = 200;
    res.end();
  });
}
