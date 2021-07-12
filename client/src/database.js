const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./db/noteAppDB.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the note_app SQlite database.');
});

let sql = 'SELECT Name as name FROM users';

// reading information from the database
db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.name);
  });
});

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});