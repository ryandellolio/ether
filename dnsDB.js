

module.exports = dnsDB;
var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var aes256 = require('aes256');
var splitRetain = require('split-retain');



function dnsDB (entry, key, query) {
    this.entry = entry;
    this.key = key;
    this.query = query;

    this.setEntry = function(s) {
        entry = s;
    }
    this.getEntry = function() {
        return entry;
    }

    this.setKey = function(s) {
        key = s;
    }
    this.getKey = function() {
        return key;
    }

    this.setQuery = function(s) {
        query = s;
    }
    this.getQuery = function() {
        return query;
    }

}

dnsDB.prototype.open = function() {

    var read = dns.resolveTxt('dns#v1-1.dellol.io', function (err, entries, family) {   
    var encrypted = entries[0][0] + entries[1][0];
    var decrypted = aes256.decrypt("key", encrypted);
    
    console.log("-------The following encrypted database was retrieved from sequential TXT records at DNS entry dns#v1-1.dellol.io -------\n")
    console.log('\x1b[33m%s\x1b[0m', encrypted);
    console.log("\n######-----This decrypts to the following---------#######\n")
    console.log('\x1b[36m%s\x1b[0m', decrypted);
    console.log("\n----------------------------------------------------------------------\n")
    console.log("Cloud query: " + "SELECT field_id as id, name, value FROM content WHERE id = '1'" + "\n")
  
    var db = new sqlite3.Database(':memory:'); 
     db.serialize(function() {
  
      var statements = splitRetain(decrypted, ';')
      
      statements.forEach( statement => {
          db.run(statement);
      });
  
      db.each("SELECT field_id as id, name, value FROM content WHERE id = '1'", function(err, row) {  
        console.log(row.value);
      });
  
    });
    
    db.close();
  
  });
  
  
};



//-----use the object

//var database = new dnsDB('dns#v1-1.dellol.io', "key", "SELECT field_id as id, name, value FROM content WHERE id = '1'");
//database.open();
