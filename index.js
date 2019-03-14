var http = require('http');
var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var aes256 = require('aes256');
var moment = require('moment');


/*
//create a server object:
http.createServer(function (req, res) {
  //code here

}).listen(80); //the server object listens on port 80

*/


var db = new sqlite3.Database('storage.db');

db.serialize(function() {


  //--------- read sqlite database to console

  db.each("SELECT field_id AS id, name, value FROM content", function(err, row) {
      console.log("The field id is " + row.id + " and the field name is " + row.name + " and the value is " + row.value + '\n');
  });
  

//----------save dump sqlite to raw sql file

  var unix_time = moment().unix();

  const { exec } = require('child_process');
  exec('sqlite3 storage.db \'.dump\' > raw-streaming.sql', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });


});

db.close();


//---------read a sqlite database file

fs.readFile('storage.db', 'utf8', function(err, data) {  
    if (err) throw err;
    console.log(data);
});


//----------query dns

var read = dns.resolveTxt('dns-field-test787.dellol.io', function (err, entries, family) {   
  
  var json_entries = JSON.stringify(entries);
  console.log(json_entries);


  //------------write file from dns query
  
        fs.writeFile('file', json_entries, function(err) {  
          if (err) throw err;
          console.log("file written")
         });


});




