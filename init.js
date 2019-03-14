var http = require('http');
var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var aes256 = require('aes256');
var moment = require('moment');


//---------read init.sql or basic-init.sql and encrypt for storage


  var key = "key";

  fs.readFile('basic-init.sql', 'utf8', function(err, data) {  
    if (err) throw err;
    console.log('encrypter: ' + aes256.encrypt(key, data));
  });