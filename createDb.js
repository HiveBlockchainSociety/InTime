var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Marley9637",
  //database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

/*con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  //Create a database named "mydb":
  con.query("CREATE TABLE user (nom VARCHAR(255),prenom VARCHAR(255), address INT(255))", function (err, result) {
    if (err) throw err;
    console.log("table created");
  });
});*/


