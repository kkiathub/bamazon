DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE departments (
	id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(45) NOT NULL,
    over_head_costs INT default 0,
    PRIMARY KEY (id)
);

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_id int NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales INT DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);


INSERT INTO departments (department_name, over_head_costs)
VALUES ("Kitchen", 1000),
		("Electronics", 10000),
        ("Skin care", 1000),
        ("Clothing", 1000);
        
SELECT * FROM departments;

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Crock Pot", 1, 25, 100), 
    ("Hand Towel", 1 , 5, 120), 
    ("Phone Charger", 2 , 12, 80 ),
    ("Laptop", 2, 600, 15),
    ("Power Bank", 2, 35, 50),
    ("Shower Gel", 3, 6, 200),
    ("Hand Lotion", 3, 9, 180),
    ("Cargo Pants", 4, 29, 120),
    ("Sweater", 4, 55, 150),
    ("Tank Top", 4, 19, 300);
    
SELECT * FROM products;



    
    