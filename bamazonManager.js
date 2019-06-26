var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
const TEXT_GREEN ="\x1b[32m%s\x1b[0m";
const TEXT_RED ="\x1b[31m%s\x1b[0m";

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

function displayProducts(checklow = false) {
    var sqlQuery = "SELECT id, product_name, price, stock_quantity FROM products";
    if (checklow) {
        sqlQuery += " WHERE stock_quantity < 5"
    }

    connection.query(sqlQuery,
        (err, itemList) => {
            if (err) throw err;
            // productData = itemList;
            if (itemList.length > 0)
                console.table(itemList);
            else
                console.log(TEXT_GREEN, "No Low Inventory Products!");
            chooseWhatToDo();
        });
}

function addToInventory() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter product ID :",
            name: "pId"
        },
        {
            type: "number",
            message: "How many units you would like to add?",
            name: "pUnits"
        }
    ]).then(function (res) {
        connection.query("SELECT * FROM products WHERE id=?", [res.pId],
            (err, queryRes) => {
                if (err) throw err;
                if (queryRes.length == 0) {
                    console.log(TEXT_RED, "Invalid product ID " + res.pId)
                } else if (isNaN(res.pUnits)) {
                    // enter invalid unit number.
                    console.log(TEXT_RED, "invalid unit number!");
                } else {
                    // enough inventory, transaction proceeds.
                    var numInStock = queryRes[0].stock_quantity + res.pUnits;
                    connection.query("UPDATE products SET stock_quantity = ? WHERE id=?", [numInStock, res.pId],
                        (err, queryRes) => {
                            if (err) throw err;
                            console.log(TEXT_GREEN, "Inventory Update completed!");
                            chooseWhatToDo();
                        });
                    return;
                }

                chooseWhatToDo();
            });
    });
}

function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter product name :",
            name: "pName"
        },
        {
            type: "list",
            message: "Please choose the department",
            choices: deptNameArr,
            name: "pDept"
        },
        {
            type: "number",
            message: "Please enter price :",
            name: "pPrice"
        },
        {
            type: "number",
            message: "Please enter stock quantity :",
            name: "pStock"
        }
    ]).then(function (res) {
        if (res.pName.trim().length === 0) {
            console.log(TEXT_RED, "Please enter product name!");
        } else if (isNaN(res.pPrice)) {
            // enter invalid unit number.
            console.log(TEXT_RED, "Invalid price!");
        } else if (isNaN(res.pStock)) {
            console.log(TEXT_RED, "Invalid stock number!");
        } else {
            var deptId = 0;
            for (var i = 0; i < deptArr.length; i++) {
                if (deptArr[i].department_name === res.pDept) {
                    deptId = deptArr[i].id;
                    break;
                }
            }
            var query = connection.query("INSERT INTO products SET ?",
                {
                    product_name: res.pName,
                    department_id: deptId,
                    price: res.pPrice,
                    stock_quantity: res.pStock
                }, (err, res) => {
                    if (err) throw err;
                    console.log(TEXT_GREEN, "Successfully added new product!");
                    chooseWhatToDo();
                });
            return;
        }
        chooseWhatToDo()
    });
}

function chooseWhatToDo() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
                name: "choice"
            }

        ]).then(function (res) {
            switch (res.choice) {
                case "View Products for Sale":
                    displayProducts();
                    break;
                case "View Low Inventory":
                    displayProducts(true);
                    break;
                case "Add to Inventory":
                    addToInventory();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
}

var deptArr = [];
var deptNameArr = [];
connection.connect(err => {
    if (err) throw err;
    
    connection.query("SELECT * FROM departments",
        (err, queryRes) => {
            if (err) throw err;
            deptArr = queryRes;
            for (var i = 0; i < deptArr.length; i++) {
                deptNameArr.push(deptArr[i].department_name);
            }
            chooseWhatToDo();
        });
});