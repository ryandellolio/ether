var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var aes256 = require('aes256');
var splitRetain = require('split-retain');

const dns_entry = 'dns#v1-1.dellol.io';
const key = 'key';
const cloud_query = "SELECT field_id as id, name, value FROM content WHERE id = '1'";

//make DNS call

var read = dns.resolveTxt(dns_entry, function (err, entries, family) {   
  
  //decrypt the first 2 entries

  var encrypted = entries[0][0] + entries[1][0];
  var decrypted = aes256.decrypt(key, encrypted);
  
  
  //write results to console

  console.log("-------The following encrypted database was retrieved from sequential TXT records at DNS entry " + dns_entry + "-------\n")
  console.log('\x1b[33m%s\x1b[0m', encrypted);
  console.log("\n######-----This decrypts to the following---------#######\n")
  console.log('\x1b[36m%s\x1b[0m', decrypted);
  console.log("\n----------------------------------------------------------------------\n")
  console.log("Cloud query: " + cloud_query + "\n")

  
  //create sqlite3 database in memory 
   
  var db = new sqlite3.Database(':memory:'); 
 
  db.serialize(function() {

    var statements = splitRetain(decrypted, ';')
    
    statements.forEach( statement => {
        db.run(statement);
    });

    db.each(cloud_query, function(err, row) {  
      console.log(row.value);
    });

  });
  
  db.close();

});









