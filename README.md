node cli.js "SELECT * FROM content" storage2.db.dellol.io false 8.8.8.8 true

node cli.js "SELECT * FROM content WHERE field_id = '91'" storage5.db.dellol.io false 8.8.8.8 false

node cli.js "INSERT INTO content (field_id, name, value) VALUES (91, 'ryan', '<h>react?</h>')" storage5.db.dellol.io true 8.8.8.8 true
