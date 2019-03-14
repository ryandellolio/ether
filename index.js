var http = require('http');
var dns = require('dns');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var aes256 = require('aes256');
var moment = require('moment');


//given an AES encrypted DNS txt field, decrypt with given key and display in log

var read = dns.resolveTxt('dns#v1-1.dellol.io', function (err, entries, family) {   
  
  var encrypted = entries[0][0];
  var key = 'key';
  var decrypted = aes256.decrypt(key, encrypted);
  
  console.log(decrypted);
  
  //use this to generate test encrypted strings
  //console.log('encrypter: ' + aes256.encrypt(key, "my name is ryan"));

  
});




