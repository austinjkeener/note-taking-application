/**
 * Note taking application server files
 */

// requiring fs
const fs = require('fs');

 // 1. require express in the document
const express = require("express");
//  1.1 require path so that i can link documents to each other
const path = require("path");
const { response } = require('express');
 // 2. create an instance of express js called app
const app = express();
 // 3. add a PORT
const PORT = process.env.PORT || 3000;

 // 5. sets up the Express app to handle data parsing
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json());
 app.use(express.static(__dirname + '/public'));

// create get request to get something from server
// view route handling -- which works with the html document
app.get("/", (req,res) => {
//  res.send("Hello world!");
   res.sendFile(path.join(__dirname + "/public/index.html"));
});
app.get("/notes", (req,res) => {
      res.sendFile(path.join(__dirname + "/public/notes.html"));
   });
   // this allows the db.json content to post to the webpage in the broswer for the user to see
app.get("/api/notes",(req, res) => {
   fs.readFile("./db/db.json",function(err, data){
      let notes = JSON.parse(data);
      res.json(notes);
   })
})

//this is going to be the part that deletes the data from the webpage in the browser
// first get id from request
app.delete("/api/notes/:id", (req, res) => {
   let id = req.params.id;
   // reading the db.json file and iterating over each part with a for loop. 
   fs.readFile("./db/db.json",function(err, data){
      let notes = JSON.parse(data);
      // finding the note that is being requested to be deleted.
      let newNotes = []
      let note;
      for (let i = 0; i < notes.length; i++) {
         if (notes[i].id == id) {
            note = notes[i];
         } else {
            newNotes.push(notes[i])
         }
      }
      // this writes the new note after the requested note has been deleted.
      fs.writeFile("./db/db.json", JSON.stringify(newNotes), err => {
         res.json(note);
      });
   })
  })  

// creating a new post request to save to server
app.post("/api/notes", (req,res) => {
   // giving every post a unique id
   var id;
   // targeting title and text variables to get their values
   let title = req.body.title;
   let text = req.body.text;
   // making json object
   let note = {
      // id set to null because i do not know the id that will go here yet. it changes for every post.
      "id":null,
      "title":title,
      "text":text
   }
   // appends to the db.json object 
   let notes;
   // this reads what is in the db.json file
   fs.readFile("./db/db.json", function(err, data){
         notes = JSON.parse(data);
         id = (new Date()).getTime();
         note.id=id;
         // notes.push is pushing the inforamtion entered in into the db.json array
         notes.push(note);
         //the response is then stringified and the note variable with the new information is returned back to the webpage inside the browser
      fs.writeFile("./db/db.json", JSON.stringify(notes), err => { 
         res.json(note);
      });
   });
})

 // api route handling -- which works with json to get data usually in the form of objects

 // 4. listen on the PORT
 app.listen(PORT, (req,res) => {
    console.log(`currently running on http://localhost:${PORT}`);
 });