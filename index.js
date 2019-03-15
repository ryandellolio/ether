//TODO: gracefully handle multiple TXT entries (somehow), both in retrieval here and in storage init
//TODO: write a query, and close method

var dnsDB = require('./dnsDB.js');

var database = new dnsDB('dns#v1-1.dellol.io', "key", "SELECT field_id as id, name, value FROM content WHERE id = '1'");
database.open();
