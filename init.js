var fs = require('fs');
var aes256 = require('aes256');

const key = "key";
const file = 'init.sql';


  fs.readFile(file, 'utf8', function(err, data) {  
    if (err) throw err;
    var encrypted_init = aes256.encrypt(key, data);
    var encrypted_storage = encrypted_init.match(/.{1,254}/g);

    console.log("Save the following in DNS, in order.  Generated from " + file + ". \n")

    encrypted_storage.forEach( blob => {
      console.log(blob + "\n");
    });


  });