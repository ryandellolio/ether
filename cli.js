//TODO - fix error handling


var dnsDB = require('./dnsDB.js');
var query = process.argv[2];
var dnsRecord = process.argv[3];
var writeMode = process.argv[4];
var dnsServer = process.argv[5];
var verbose = process.argv[6];


// -- 
// -- 
// -- node cli.js "SELECT * FROM content" storage2.db.dellol.io false 8.8.8.8 true
// --
// --
// --

var output = dnsDB(dnsRecord, "key", writeMode, dnsServer, verbose, function ( db, debug, ){  //creates a sqlite3 db from a DNS call.  true denotes write mode

    db.serialize(function() {         //use as you normally would per https://www.npmjs.com/package/sqlite3

        db.each(query, function(err, row) {  

            //display
            if(row){
                console.log('\x1b[34m%s\x1b[0m', row.field_id + " | " + row.name + " | " + row.value); 
            } else if( row == undefined ){
                console.log('\x1b[31m%s\x1b[0m', "Empty response");
            } else {
                console.log('\x1b[31m%s\x1b[0m', err);
            }
        
        });
        
        db.exec("", function ( ){
            if(verbose == 'true'){
                console.log(debug);
            } 
        });
                
    }); 

});  