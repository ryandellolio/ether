PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "content" (
    "field_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
    "name"	TEXT,
    "value"	TEXT
  );
INSERT INTO content VALUES(1,'description','<p>Kate</p>');
INSERT INTO content VALUES(2,'description','<p>Ryan</p>');
INSERT INTO content VALUES(3,'description','<p>Stella</p>');
INSERT INTO content VALUES(4,'pet','<p>Dog</p>');
INSERT INTO content VALUES(5,'notpet','<p>Cat</p>');
INSERT INTO content VALUES(9,'description','<p>Stella</p>');
INSERT INTO content VALUES(15,'description','<p>Stella</p>');
INSERT INTO content VALUES(18,'description','<p>Stella</p>');
INSERT INTO content VALUES(19,'description','<p>Stella</p>');
INSERT INTO content VALUES(44,'description','<p>Stella</p>');
INSERT INTO content VALUES(47,'room','Lorem');
INSERT INTO content VALUES(555,'first cli generated pet','<p>Cat</p>');
INSERT INTO content VALUES(5556,'Steak','<p>Cat</p>');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('content',5556);
COMMIT;
