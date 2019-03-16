//TODO - add read only mode to dnsDB and if it's a writable mode, write to AWS Route 53
//TODO - have dnsdb provide output to re-save to DB

var dnsDB = require('./dnsDB.js');
var query = process.argv[2];

if(process.argv[3] == "true")
    var writeMode = true;
else
    var writeMode = false;


var data = dnsDB('storage.db.dellol.io', "key", writeMode, function ( db ){  //creates a sqlite3 db from a DNS call.  true denotes write mode

    db.serialize(function() {         //use as you normally would per https://www.npmjs.com/package/sqlite3

        db.each(query, function(err, row) {  
          if(err)
            console.log('\x1b[31m%s\x1b[0m', err);
          if(row)
            console.log('\x1b[32m%s\x1b[0m', row.field_id + " | " + row.name + " | " + row.value);            
        });
        
        
        /*
        //programatic example
        db.each("SELECT * FROM content", function(err, row) {  
            if(err)
              console.log('\x1b[31m%s\x1b[0m', err);
            if(row)
              console.log('\x1b[32m%s\x1b[0m', row.field_id + " | " + row.name + " | " + row.value);            
          }); 

          */
        
    }); 

});  
