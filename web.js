var dnsDB = require('./dnsDB.js');
var http = require('http');

//create a server object:
http.createServer(function (req, res) {

    var data = dnsDB('storage2.db.dellol.io', "key", false, function ( db ){ 

        db.serialize(function() {    
            
            res.writeHead(200, {"Content-Type":"text/html"});
            db.each("SELECT * FROM content", function(err, row) {  
              if(err)
                res.write(err);
              if(row)
                res.write(row.field_id + " | " + row.name + " | " + row.value + "<br />"); 
            
            });

            db.exec("", function () {
                res.end(); //end the response
            });
        });     
    });  
}).listen(80); 
