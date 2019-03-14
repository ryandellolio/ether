PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "content" (
    "field_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
    "name"	TEXT,
    "value"	TEXT
  );
INSERT INTO content VALUES(1,'description','<p>Heading</p>');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('content',1);
COMMIT;
