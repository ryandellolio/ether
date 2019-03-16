//TODO - add read only mode to dnsDB and if it's a writable mode, write to AWS Route 53
//TODO - have dnsdb provide output to re-save to DB

var dnsDB = require('./dnsDB.js');
var query = "SELECT field_id as id, name, value FROM content WHERE name = 'pet'";


var save = dnsDB('dns#v1-1.dellol.io', "key", function ( db ){  //creates a sqlite3 db from a DNS call

    db.serialize(function() {         //use as you normally would per https://www.npmjs.com/package/sqlite3

        console.log('\x1b[4m%s\x1b[0m', query);
        db.each(query, function(err, row) {  
          if(err)
            console.log('\x1b[31m%s\x1b[0m', err);
          if(row)
            console.log('\x1b[32m%s\x1b[0m', row.id + " | " + row.name + " | " + row.value);            
        }); 
      
    }); 
  

      

});  


