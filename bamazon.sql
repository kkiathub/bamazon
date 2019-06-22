DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Crock Pot", "Kitchen", 25, 100), 
    ("Hand Towel", "Kitchen" , 5, 120), 
    ("Phone Charger", "Electornics" , 12, 80 ),
    ("Laptop", "Electronics", 600, 15),
    ("Power Bank", "Electornics", 35, 50),
    ("Shower Gel", "Skin care", 6, 200),
    ("Hand Lotion", "Skin care", 9, 180),
    ("Cargo Pants", "Clothing", 29, 120),
    ("Sweater", "Clothing", 55, 150),
    ("Tank Top", "Clothig", 19, 300);
    
SELECT * FROM products;

UPDATE products SET stock_quantity = 50 WHERE id=5;
    
    