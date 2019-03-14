var http = require('http');
var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var aes256 = require('aes256');
var moment = require('moment');


//given an AES encrypted DNS txt field, decrypt with given key and display in log

var read = dns.resolveTxt('dns#v1-1.dellol.io', function (err, entries, family) {   
  
  var encrypted = entries[0][0];
  var key = 'key';
  var decrypted = aes256.decrypt(key, encrypted);
  
  console.log(decrypted);

  var db = new sqlite3.Database(':memory:');
 
  db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");
 
  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();
 
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});
 
db.close();

});









