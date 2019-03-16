//TODO: gracefully handle multiple TXT entries (somehow), both in retrieval here and in storage init
var dnsDB = require('./dnsDB.js');
var sqlite3 = require('sqlite3').verbose();

var container = new dnsDB('dns#v1-1.dellol.io', "key", function ( db ){



  console.log(db);
  db.serialize(function() {         

    db.each("SELECT field_id as id, name, value FROM content WHERE id = '1'", function(err, row) {  
      console.log(row.id + " | " + row.name + " | " + row.value);
      
      
    }); 
  
  }); 


});  
