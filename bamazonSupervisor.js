var inquirer = require("inquirer");
var mysql = require("mysql");

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

// product_sales
// total_profit
    var sqlStr = "SELECT departments.id AS department_id, department_name, over_head_costs"
            + ", SUM(products.product_sales) AS product_sales"
            + " FROM departments, products"
            + " WHERE departments.id=products.department_id"
            + " GROUP BY products.department_id";

    var query = connection.query(sqlStr,
        (err, res) => {
            if (err) throw err;
            console.table(res);
            connection.end();
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
                    break;
                default:
                    connection.end();
                    break;
            }
        });
}

chooseWhatToDo();