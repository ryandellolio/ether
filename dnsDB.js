module.exports = dnsDB;

var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var aes256 = require('aes256');
var splitRetain = require('split-retain');



function dnsDB (entry, key, query) {

    // set up class properties, and register getters and setters

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

//open function
dnsDB.prototype.open = function() {
    
    var entry = this.getEntry();
    var key = this.getKey();
    var query = this.getQuery();

    var read = dns.resolveTxt(entry, function (err, entries, family) {   
        var encrypted = entries[0][0] + entries[1][0];
        var decrypted = aes256.decrypt(key, encrypted);
        
        console.log("-------The following encrypted database was retrieved from sequential TXT records at DNS entry " + entry + " -------\n")
        console.log('\x1b[33m%s\x1b[0m', encrypted);
        console.log("\n######-----This decrypts to the following---------#######\n")
        console.log('\x1b[36m%s\x1b[0m', decrypted);
        console.log("\n----------------------------------------------------------------------\n")
        console.log("Cloud query: " + query + "\n")
    
        var db = new sqlite3.Database(':memory:'); 
        db.serialize(function() {
    
        var statements = splitRetain(decrypted, ';')
        
        statements.forEach( statement => {
            db.run(statement);
        });
    
        db.each(query, function(err, row) {  
            console.log(row.value);
        });
  
    });
    
    db.close();
  
  });
  
  
};


//query function
dnsDB.prototype.query = function() {

};

//close function
dnsDB.prototype.close = function() {

};

