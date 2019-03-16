module.exports = dnsDB;

var dns = require('dns');
var aes256 = require('aes256');
var splitRetain = require('split-retain');
var sqlite3 = require('sqlite3').verbose();


function dnsDB (entry, key, callback) {

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

    //constructor to get the db and store it to memory using sqlite


    var db = new sqlite3.Database(':memory:'); 

    var read = dns.resolveTxt(entry, function (err, entries, family) {
        
        var encryptedRecordsInOrder = Array();

        entries.forEach(function(entry) {
            var rawString = entry[0];
            var parts = rawString.split("###");
            var sortOrder = parts[0];
            encryptedRecordsInOrder[sortOrder] = parts[1];
        });

        var encrypted = encryptedRecordsInOrder.join('');
        var decrypted = aes256.decrypt(key, encrypted);

        /*
        //VERBOSE MODE

        console.log("-------The following encrypted database was retrieved from sequential TXT records at DNS entry " + entry + " -------\n")
        console.log('\x1b[33m%s\x1b[0m', encrypted);
        console.log("\n######-----This decrypts to the following---------#######\n")
        console.log('\x1b[36m%s\x1b[0m', decrypted);
        console.log("\n----------------------------------------------------------------------\n")
        */

        db.serialize(function() {

            var statements = splitRetain(decrypted, ';') //split statements

            //instantiate the db by executing decrypted statements from TXT records
            statements.forEach( statement => {
                db.run(statement);
            });

            callback(db);  //execute things


        });
        


    });

    


}






