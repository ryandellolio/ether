var fs = require('fs');
var aes256 = require('aes256');

const key = "key";
const file = 'init.sql';


  fs.readFile(file, 'utf8', function(err, data) {  
    if (err) throw err;
    var encrypted_init = aes256.encrypt(key, data);
    var encrypted_storage = encrypted_init.match(/.{1,254}/g);

    console.log("Save the following 254 character entries DNS, in order.  Generated from " + file + ". \n")

    encrypted_storage.forEach( blob => {
      console.log(blob + "\n");
    });

    console.log("Or, for Route53 notation\n")

    encrypted_storage.forEach( blob => {
      process.stdout.write("\"" + blob + "\"\n");
    });

    console.log("\n");

  });