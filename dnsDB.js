module.exports = dnsDB;


var dns = require('dns');
var aes256 = require('aes256');
var splitRetain = require('split-retain');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
splitChar = "###";
var output = [];


function dnsDB (entry, key, writeMode, dnsServer, verbose, callback) {
    // start the function
    // set up class properties, and register getters and setters

    this.entry = entry;
    this.key = key;
    this.writeMode = writeMode;

    //set up debug array
    var debug = [ ];

   
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

    //actually set the DNS server
    dns.setServers([dnsServer]);

    var example = dns.resolveTxt(entry, function (err, entries, family) {
        
        //we are inside our first callback, waiting for TXT records to come back! 
        //once that's done.....

        var encryptedRecordsInOrder = Array();
        if(entries){
            entries.forEach(function(entry) {
                var rawString = entry[0];
                var parts = rawString.split(splitChar);
                var sortOrder = parts[0];
                encryptedRecordsInOrder[sortOrder] = parts[1];
            });

        } else{
            console.log('\x1b[31m%s\x1b[0m', "Entry does not exist");
            return;
        }


        var encrypted = encryptedRecordsInOrder.join('');
        if(encrypted){
            var decrypted = aes256.decrypt(key, encrypted);

            //debug
            debug['txt'] = entries;
            debug['entries'] = encryptedRecordsInOrder;
            debug['raw'] = encrypted;
            debug['key'] = key;
            debug['decrypted'] = decrypted;
            


        } else {
            console.log('\x1b[31m%s\x1b[0m', "Malformed record");
            return;
        }
        
        servers = dns.getServers();
        debug['decrypted'] = decrypted;
        debug['record'] = entry;
        debug['dnsserver'] = servers[0];
        debug['writeMode'] = writeMode;


        if( writeMode == true ){
            //if write mode is on, use the slower method but we need this to do a sqlite dump
            var db = new sqlite3.Database('storage.db', (err) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
        }); 

        } else {
            //we will use sqlite3 memory mode if read only, to make this faster
            var db = new sqlite3.Database(':memory:', (err) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
            });
        }
        
        db.serialize(function() {     //actually work with the DB
            var statements = splitRetain(decrypted, ';') //split statements

            //instantiate the db by executing decrypted statements from TXT records
            var n = 0;
            debug['init'] = [];
            debug['statements'] = [];

            statements.forEach( statement => {
                db.exec(statement);
                debug['init'][n] = statement;
                debug['statements'][n] = statement.replace(/(\r\n|\n|\r)/gm,"");
                n++;
            });
            
            


            //nest another serialized set of instructions to ensure API user's instructions happen after the DB is initialized.  This makes dnsDB seamless
            db.serialize(function() {
                

                    //next another serial function with an innocous exec command to execute after
                    db.serialize(function() {
                        db.exec("", function ( ){
                        
                            //this ONLY happens once everything is done
                            if(writeMode == 'true'){
                                
                                sqlFileToStatementArray('storage.db', function ( output ) {
                                        //finally we are done
                                        //close db and delete storage file, and save write array
                                        db.close;
                                        fs.unlinkSync("./storage.db");
                                        
                                });                                
                                
                            } else {                    
                                //no write mode, therefore go on what you would do with memory
                                db.close;
                
                            } 
                        });
                });
                //finally do the callback with debug statements
                callback(db, debug);                 
                

        
            });
            
        });  
        
    });
}


function sqlFileToStatementArray( filename, callback ) {
        var save = [];
        //write db to plaintext for temp storage
        const { exec } = require('child_process');
        exec('sqlite3 ' + filename + ' .dump > lastPlainText.sql', (error, stdout, stderr) => {  //ti

            fs.readFile('./lastPlainText.sql', 'utf8', function(err, data) {  
                

                if (err) throw err;
                var encrypted_init = aes256.encrypt(key, data);
                var encrypted_storage = encrypted_init.match(/.{1,200}/g);


                var sort = 0;
                encrypted_storage.forEach( blob => {
                    //read out to console
                    save[sort] = sort + splitChar + blob;
                    sort++;
                    
                }); 
                               
                callback(); 
                console.log("\nSAVE---")
                console.log(save);
            });
            
        });

}


