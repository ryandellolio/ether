//TODO: gracefully handle multiple TXT entries (somehow), both in retrieval here and in storage init
//TODO - add read only mode to dnsDB and if it's a writable mode, write to AWS Route 53

var dnsDB = require('./dnsDB.js');

dnsDB('dns#v1-1.dellol.io', "key", function ( db ){  //creates a sqlite3 db from a DNS call

  db.serialize(function() {         //use as you normally would per https://www.npmjs.com/package/sqlite3
  
    db.each("SELECT field_id as id, name, value FROM content WHERE id = '1'", function(err, row) {  
      if(err)
        console.log(err);
      if(row)
        console.log(row.id + " | " + row.name + " | " + row.value);
    }); 
  }); 


});  
