var http = require('http');
var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();

/*
//create a server object:
http.createServer(function (req, res) {
  //code here

}).listen(80); //the server object listens on port 80

*/

var db = new sqlite3.Database('storage');
var read = dns.resolveTxt('dns-field-test787.dellol.io', function (err, entries, family) {   //query dns and write response to entries variable
  console.log(JSON.stringify(entries));
});


db.serialize(function() {
  db.run(`
  
  CREATE TABLE IF NOT EXISTS "content" (
    "field_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
    "name"	TEXT,
    "value"	TEXT
  );
  
  `);

  db.each("SELECT field_id AS id, name, value FROM content", function(err, row) {
      console.log(row.id + " " + row.name + " "+ row.value + '\n');
  });
});

db.close();