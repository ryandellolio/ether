module.exports = dnsDB;

var dns = require('dns');
var aes256 = require('aes256');
var splitRetain = require('split-retain');
var sqlite3 = require('sqlite3').verbose();




function dnsDB (entry, key) {

    // set up class properties, and register getters and setters

    this.entry = entry;
    this.key = key;
   
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



}


//constructor to get the db and store it to memory using sqlite
//query function
dnsDB.prototype.open = function(  ) {

    global.db = new sqlite3.Database(':memory:'); 
    entry = this.getEntry();
    key = this.getKey();

    var read = dns.resolveTxt(entry, function (err, entries, family) {   
        var encrypted = entries[0][0] + entries[1][0];
        var decrypted = aes256.decrypt(key, encrypted);
        
        console.log("-------The following encrypted database was retrieved from sequential TXT records at DNS entry " + entry + " -------\n")
        console.log('\x1b[33m%s\x1b[0m', encrypted);
        console.log("\n######-----This decrypts to the following---------#######\n")
        console.log('\x1b[36m%s\x1b[0m', decrypted);
        console.log("\n----------------------------------------------------------------------\n")

        db.serialize(function() {

            var statements = splitRetain(decrypted, ';')
            
            statements.forEach( statement => {
                db.run(statement);
            });
        });

    });

}



//query function
dnsDB.prototype.query = function( statement ) {
/*
    this.statement = statement;



    db.serialize(function() {

        db.each("SELECT field_id as id, name, value FROM content WHERE id = '1'", function(err, row) {  
            //console.log(row.id);
            //console.log("SELECT field_id as id, name, value FROM content WHERE id = '1'");
        }); 
      

    });
*/
  
};

//close function
dnsDB.prototype.close = function( ) {
    //db.close();
    //console.log("CLOSED");

};

