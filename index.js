var http = require('http');
var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var aes256 = require('aes256');

/*
//create a server object:
http.createServer(function (req, res) {
  //code here

}).listen(80); //the server object listens on port 80

*/

//-----1-----create and read sqlite database

var db = new sqlite3.Database('storage');
db.serialize(function() {
  db.run(`CREATE TABLE IF NOT EXISTS "content" (
        "field_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
        "name"	TEXT,
        "value"	TEXT
        
      
      ); `);

  

  db.each("SELECT field_id AS id, name, value FROM content", function(err, row) {
      console.log("The field id is " + row.id + " and the field name is " + row.name + " and the value is " + row.value + '\n');
  });
  

//-----2---------save the raw sql into a file

  const { exec } = require('child_process');
  exec('sqlite3 storage \'.dump\' > raw.sql', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });


});

db.close();


//-----2-----read the sqlite database file

fs.readFile('storage', 'utf8', function(err, data) {  
    if (err) throw err;
    console.log(data);
});

//-----3-----query dns

var read = dns.resolveTxt('dns-field-test787.dellol.io', function (err, entries, family) {   
  
  var json_entries = JSON.stringify(entries);
  console.log(json_entries);


  //-----4-------write file from dns query
  
        fs.writeFile('file', json_entries, function(err) {  
          if (err) throw err;
          console.log("file written")
         });


});




