var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "kkroot",
    database: "bamazonDB"
});

var productData = [];

function findProductFromTable(id) {
    for(var i=0; i<productData.length; i++) {
        if (id==productData[i].id) {
            // found product
            return i;
        }
    }
    return -1;
}

function userPrompt() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter product ID you would like to buy :",
            name: "pId"
        },
        {
            type: "number",
            message: "How many units you would like to buy?",
            name: "pUnits"
        }
    ]).then(function (res) {
        var prodId = findProductFromTable(res.pId);
        if (prodId < 0) {
            // product not found.
            console.log("Invalid product ID!");
        } else if (isNaN(res.pUnits)) {
            // enter invalid unit number.
            console.log("invalid unit number!");
        } else if ( productData[prodId].stock_quantity < res.pUnits) {
            console.log("Insufficient quantity!");
        } else {
            // enough inventory, transaction proceeds.
            var numLeft = productData[prodId].stock_quantity - res.pUnits;
            connection.query("UPDATE products SET stock_quantity = ? WHERE id=?",[ numLeft , res.pId] ,
            (err, queryRes) => {
                if (err) throw err;
                console.log("Order completed: total price : " + res.pUnits * productData[prodId].price );
            });

        }

        connection.end();
    });
}

function displayProducts() {

    var query = connection.query("SELECT * FROM products",
        (err, itemList) => {
            if (err) throw err;
            productData = itemList;
            console.table(itemList);
            userPrompt();
        });
}


displayProducts();