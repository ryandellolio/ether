var http = require('http');
var dns = require('dns');


var w3 = dns.resolveTxt('dns-field-test787.dellol.io', function (err, responses, family) {
  var entries = responses;
});


//create a server object:
http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
