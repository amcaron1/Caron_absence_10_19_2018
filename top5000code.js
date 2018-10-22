// inquirer is used to query the user
var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "top5000"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection(){
    inquirer
    .prompt([

        // Here we give the user a list to choose from.
        {
            type: "list",
            message: "Song Options",
            choices:
                [   "All of the top 5000 songs by a particular artist",
                    "All of the artists with multiple top 5000 songs",
                    "All of the top 5000 songs between two particular years",
                    "A particular song"],
            name: "songOptions",
        },
    ])
    .then(function(response) {

        switch (response.songOptions){

            case "All of the top 5000 songs by a particular artist":
                
                artist();
                break;

            case "All of the artists with multiple top 5000 songs":
                
                multiples();
                break;

            case "All of the top 5000 songs between two particular years":
                
                years();
                break;

            case "A particular song":
                
                song();
                break;

            // If the action does not match one of the cases, the user is alerted that the input is invalid
            default:
                console.log("You must make a selection");
        }
    })
}

function artist() {
    
    inquirer.prompt([
        {
            name: "artist",
            message: "Who is the artist?"
        }
    ]).then(function(answers) {
        connection.query("SELECT * FROM songs WHERE ?",
        {
            artist: answers.artist
        },
            function(err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++){
                    console.log(res[i]);
                }
                connection.end();
            }
        )
    })
}

function multiples() {
    connection.query("SELECT COUNT(1) AS count, artist FROM songs GROUP BY artist HAVING COUNT(song) > 1",
        function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                console.log(res[i].artist + ": " + res[i].count);
            }
            connection.end();
        }
    )
}

function years() {
    inquirer.prompt([
        {
            name: "start_year",
            message: "Start year?"
        },
        {
            name: "end_year",
            message: "End year?"
        }
    ]).then(function(answers) {
        connection.query("SELECT * FROM songs WHERE year BETWEEN " + answers.start_year + " AND " + answers.end_year,
            function(err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++ ){
                        console.log(res[i].artist + " " + res[i].song + " " + res[i].year);
                }
                connection.end();
            }
        )
    })
}

function song() {
    
    inquirer.prompt([
        {
            name: "song",
            message: "What is the song?"
        }
    ]).then(function(answers) {
        connection.query("SELECT * FROM songs WHERE ? ORDER BY year LIMIT 1",
        {
            song: answers.song
        },
            function(err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++){
                    console.log(res[i]);
                }
                connection.end();
            }
        )
    })
}

// SELECT * FROM songs ORDER BY raw_uk DESC LIMIT 100
// SELECT * FROM songs WEHRE song LIKE "The %" 
// SELECT * FROM songs WHERE song LIKE "Strangers in the nigh_"