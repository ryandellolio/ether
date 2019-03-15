//TODO: gracefully handle multiple TXT entries (somehow), both in retrieval here and in storage init
//TODO: DNS shell?  basically open by reading, get to a sqlite prompt, then close by writing

var dnsDB = require('./dnsDB.js');

var database = new dnsDB('dns#v1-1.dellol.io', "key", "SELECT field_id as id, name, value FROM content WHERE id = '1'");
database.open();