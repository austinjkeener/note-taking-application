/**
 * Note taking application server files
 */

// requiring fs
const fs = require('fs');

 // 1. require express in the document
const express = require("express");
//  1.1 require path so that i can link documents to each other
const path = require("path");
 // 2. create an instance of express js called app
const app = express();
 // 3. add a PORT
const PORT = process.env.PORT || 3000;

 // 5. sets up the Express app to handle data parsing
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json());
 app.use(express.static(__dirname + '/public'));

 // view route handling -- which works with the html document
 app.get("/", (req,res) => {
//  res.send("Hello world!");
   res.sendFile(path.join(__dirname + "/public/index.html"));
});
app.get("/notes", (req,res) => {
   //  res.send("Hello world!");
      res.sendFile(path.join(__dirname + "/public/notes.html"));
   });

app.post("/api/notes", (req,res) => {
   // targeting title and text variables
   let title = req.body.title;
   let text = req.body.text;
   console.log(title);
   console.log(text);
   // making json object
   let note = {
      "title":title,
      "text":text
   }
   // appends to the db.json object 
   let notes;
   fs.readFile("/db/db.json", function(err, data){
         notes = JSON.parse(data);
         
   });
      
   notes.push(note);
   fs.writeFile("/db/db.json", JSON.stringify(notes), err => { 
       console.log("Done writing"); // Success 
   });
})
 // api route handling -- which works with json to get data usually in the form of objects

 // 4. listen on the PORT
 app.listen(PORT, (req,res) => {
    console.log(`currently running on http://localhost:${PORT}`);
 });