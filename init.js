var fs = require('fs');
var aes256 = require('aes256');

const key = "key";
const file = 'init.sql';


            fs.readFile(file, 'utf8', function(err, data) {  
              if (err) throw err;
              var encrypted_init = aes256.encrypt(key, data);
              var encrypted_storage = encrypted_init.match(/.{1,200}/g);

              var sort = 1;
              encrypted_storage.forEach( blob => {
                process.stdout.write("\"" + sort+ "###" + blob + "\"\n\n");
                sort++;
              });
              

            });