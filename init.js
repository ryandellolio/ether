var http = require('http');
var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var aes256 = require('aes256');
var moment = require('moment');


//---------read init.sql or basic-init.sql and encrypt for storage


  var key = "key";

  fs.readFile('init.sql', 'utf8', function(err, data) {  
    if (err) throw err;
    var encrypted_init = aes256.encrypt(key, data);
    console.log("Save the following in DNS------------")
    console.log(encrypted_init.match(/.{1,254}/g));
  });