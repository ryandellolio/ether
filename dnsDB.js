module.exports = dnsDB;


var dns = require('dns');
var aes256 = require('aes256');
var splitRetain = require('split-retain');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');


function dnsDB (entry, key, writeMode, callback) {
    // start the function
    // set up class properties, and register getters and setters

    this.entry = entry;
    this.key = key;
    this.writeMode = writeMode;
   
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


    var read = dns.resolveTxt(entry, function (err, entries, family) {
        
        //we are inside our first callback, waiting for TXT records to come back! 
        //once that's done.....

        var encryptedRecordsInOrder = Array();

        entries.forEach(function(entry) {
            var rawString = entry[0];
            var parts = rawString.split("###");
            var sortOrder = parts[0];
            encryptedRecordsInOrder[sortOrder] = parts[1];
        });

        var encrypted = encryptedRecordsInOrder.join('');
        var decrypted = aes256.decrypt(key, encrypted);

        //console.log(decrypted);
        /*
        //VERBOSE MODE

        console.log("-------The following encrypted database was retrieved from sequential TXT records at DNS entry " + entry + " -------\n")
        console.log('\x1b[33m%s\x1b[0m', encrypted);
        console.log("\n######-----This decrypts to the following---------#######\n")
        console.log('\x1b[36m%s\x1b[0m', decrypted);
        console.log("\n----------------------------------------------------------------------\n")
        */
       if( writeMode == true ){
            //if write mode is on, use the slower method but we need this to do a sqlite dump
            var db = new sqlite3.Database('storage.db', (err) => {
                if (err) {
                    console.error(err.message);
                }
        }); 

        } else {
            //we will use sqlite3 memory mode if read only, to make this faster
            var db = new sqlite3.Database(':memory:', (err) => {
                if (err) {
                    console.error(err.message);
                }
            });
        }
        db.serialize(function() {     //actually work with the DB
            var statements = splitRetain(decrypted, ';') //split statements

            //instantiate the db by executing decrypted statements from TXT records
            statements.forEach( statement => {
                db.exec(statement);
            });

            //nest another serialized set of instructions to ensure API user's instructions happen after the DB is initialized.  This makes dnsDB seamless
            db.serialize(function() {
                callback(db);
                    //next another serial function with an innocous exec command to execute after
                    db.serialize(function() {
                        db.exec("SELECT * FROM CONTENT", function ( ){
                            //this ONLY happens once everything is done
                            if(writeMode == true){
                                sqliteToAWSconsole('storage.db', function () {
                                    //finally we are done
                                    //close db and delete files
                                    db.close;
                                    fs.unlinkSync("./storage.db");
                                    //fs.unlinkSync("./lastPlainText.sql");
                                });
                            } else {
                                db.close;
                            }


                        });
                    });
            });
        });  
       
    });
}




function sqliteToAWSconsole( filename, callback ) {
    
    //write db to plaintext for temp storage
        const { exec } = require('child_process');
        exec('sqlite3 ' + filename + ' .dump > lastPlainText.sql', (error, stdout, stderr) => {
        


            fs.readFile('lastPlainText.sql', 'utf8', function(err, data) {  
                if (err) throw err;
                var encrypted_init = aes256.encrypt(key, data);
                var encrypted_storage = encrypted_init.match(/.{1,200}/g);

                var sort = 1;
                encrypted_storage.forEach( blob => {
                    //read out to console
                    process.stdout.write("\"" + sort+ "###" + blob + "\"\n\n");
                    sort++;
                }); 
                callback();                
                
            });
            
        });

        


}


