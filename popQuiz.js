var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "pop_quiz_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
  });

function afterConnection() {
    connection.query("SELECT * FROM teams", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            console.log(res[i].id + " " + res[i].favorite_teams);
        }
        connection.end();
    })
}