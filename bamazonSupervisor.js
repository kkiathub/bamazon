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

function viewProductSales() {
    var sqlStr = "SELECT departments.id AS department_id, department_name, over_head_costs"
        + ", IFNULL(SUM(products.product_sales), 0) AS product_sales"
        + ", CASE WHEN IFNULL(SUM(products.product_sales), 0) > over_head_costs"
        + " THEN SUM(products.product_sales) - over_head_costs ELSE 0"
        + " END as total_profit"
        + " FROM departments"
        + " LEFT JOIN products"
        + " ON departments.id=products.department_id"
        + " GROUP BY departments.id";

    var query = connection.query(sqlStr,
        (err, res) => {
            if (err) throw err;
            console.table(res);
            chooseWhatToDo();
        });
}

function createNewDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter department name :",
            name: "pName"
        },
        {
            type: "number",
            message: "Please enter over head costs :",
            name: "pCost"
        },

    ]).then(function (res) {
        if (res.pName.trim().length === 0) {
            console.log(TEXT_RED, "Please enter department name!");
        } else if (isNaN(res.pCost)) {
            // enter invalid unit number.
            console.log(TEXT_RED, "Invalid over head costs!");
        } else {
            var query = connection.query("INSERT INTO departments SET ?",
                {
                    department_name: res.pName,
                    over_head_costs: res.pCost,
                }, (err, res) => {
                    if (err) throw err;
                    console.log(TEXT_GREEN, "Successfully created new department!");
                    chooseWhatToDo();
                });
            return;
        }
        chooseWhatToDo();
    });
}

function chooseWhatToDo() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View Product Sales by Department", "Create New Department", "Exit"],
                name: "choice"
            }

        ]).then(function (res) {
            switch (res.choice) {
                case "View Product Sales by Department":
                    viewProductSales();
                    break;
                case "Create New Department":
                    createNewDepartment();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
}

connection.connect(err => {
    if (err) throw err;
    chooseWhatToDo();
});