var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var aes256 = require('aes256');
var splitRetain = require('split-retain');

const dns_entry = 'dns#v1-1.dellol.io';
const key = 'key';

//make DNS call

var read = dns.resolveTxt(dns_entry, function (err, entries, family) {   
  
  //decrypt the first 2 entries

  var encrypted = entries[0][0] + entries[1][0];
  var decrypted = aes256.decrypt(key, encrypted);
  
  
  //write results to console

  console.log("-------The following decrypted database was retrieved from DNS-------\n")
  console.log(decrypted);
  console.log("\n----------------------------------------------------------------------\n")

  //create sqlite3 database in memory 
   
  var db = new sqlite3.Database(':memory:'); //:memory:
 
  db.serialize(function() {

    var statements = splitRetain(decrypted, ';')
    
    statements.forEach( statement => {
        db.run(statement);
    });

    db.each("SELECT field_id AS id, name, value FROM content", function(err, row) {  
      console.log(row.name + " - " + row.value);
    });

  });
  
  db.close();

});









