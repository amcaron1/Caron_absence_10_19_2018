// inquirer is used to query the user
var inquirer = require("inquirer");

var mysql = require("mysql");

var productArray = [];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "store_db"
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
            message: "Great Bay Options",
            choices:
                [   "Post an item",
                    "Bid on an item"],
            name: "gbOptions",
        },
    ])
    .then(function(response) {

        switch (response.gbOptions){

            case "Post an item":
                
                post();
                break;

            case "Bid on an item":
                
                bid();
                break;

            // If the action does not match one of the cases, the user is alerted that the input is invalid
            default:
                console.log("You must make a selection");
        }
    })
}

function post() {
    
    // Prompt the user for an item
    inquirer.prompt([
        {
            name: "product_name",
            message: "What is the product name?"
        },
        {
            name: "seller",
            message: "What is your name?"
        },
        {
            name: "stock_quantity",
            message: "How many do you have to sell?"
        }
    ]).then(function(answers) {

        if (answers.stock_quantity > 0) {
            connection.query("INSERT INTO products SET ?",
            {
                product_name: answers.product_name,
                seller: answers.seller,
                highest_bid: 0,
                stock_quantity: answers.stock_quantity
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " products updated!\n");
                connection.end();
            })
        }
        else {
            console.log("Invalid stock quantity.  Must be a number greater than zero.");
            connection.end();
        }
    })
}

function bid() {

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            productArray.push(res[i].id + " " + res[i].product_name + " " + res[i].seller + " " + "$" + res[i].highest_bid + " " + res[i].stock_quantity);
        }
        // Prompt the user for an item
        inquirer.prompt([
            {
                type: "list",
                message: "Product Options",
                choices: productArray,
                name: "productOptions",
            },
            {
            name: "user_bid",
            message: "What is your bid?"
            }
        ]).then(function(answers) {
            var endIndex = answers.productOptions.indexOf(" ");
            var user_item_id = answers.productOptions.slice(0,endIndex);
            if (answers.user_bid > res[user_item_id].highest_bid) {
                connection.query("UPDATE products SET ? WHERE ?",[
                {
                    highest_bid: answers.user_bid
                },
                {
                    id: user_item_id
                }
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " products updated!\n");
                    connection.end();
                })
            }
            else {
                console.log("Invalid bid.  Must be higher than current highest bid.");
                connection.end();
            }
        })
    })
}