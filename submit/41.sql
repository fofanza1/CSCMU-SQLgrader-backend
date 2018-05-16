---------Quiz#2----------

--start#2.1
SELECT customerName, state, city
FROM customers
WHERE state LIKE "CA" AND city LIKE "San Francisco"
--finish#2.1

--start#2.2
SELECT officeCode, addressLine1, addressLine2
FROM offices
WHERE addressLine2 IS NULL
--finish#2.2

--start#2.3
SELECT firstName, lastName, email
FROM employees INNER JOIN offices ON employees.officeCode = offices.officeCode
WHERE city LIKE "Boston"
--finish#2.3

--start#2.4
SELECT customers.customerName, orders.orderDate
FROM customers INNER JOIN orders ON customers.customerNumber = orders.customerNumber
WHERE orders.orderDate LIKE "2004_04%" OR orders.orderDate LIKE "2004_05%"  
ORDER BY `orders`.`orderDate` DESC
--finish#2.4

--start#2.5
SELECT customers.customerNumber, customers.customerName
FROM customers LEFT OUTER JOIN orders ON customers.customerNumber = orders.customerNumber
WHERE orders.orderNumber IS NULL
--finish#2.5

*--start#2.6
SELECT employees.firstName, employees.lastName, m.firstName AS Supervisor_FirstName, m.lastName AS Supervisor_LastName, m.city AS Supervisor_City
WHERE employees INNER JOIN m ON employees.reportsTo = m.reportsTo
--finish#2.6

--start#2.7
SELECT MAX(products.buyPrice) AS MAX_Price, MIN(products.buyPrice)AS MIN_Price, MAX(products.quantityInStock) AS MAX_Remain
FROM products
--finish#2.7

*--start#2.8

--finish#2.8

*--start#2.9
SELECT customers.customerName, SUM(payments.amount) AS Total_Price
FROM customers INNER JOIN payments ON customers.customerNumber = payments.customerNumber
GROUP BY customers.customerName
HAVING Total_Price > 150000  
ORDER BY `Total_Price`  DESC
--finish#2.9

--start#2.10
INSERT INTO productlines
VALUES ('Computer', 'Computer Notebook', NULL, NULL)
--finish#2.10

--start#2.11
DELETE FROM productlines
WHERE productlines.productLine = "Computer"
--finish#2.11

--start#2.12
UPDATE offices
SET offices.addressLine2 = "Floor #4" , offices.state = "MA"
WHERE offices.officeCode = "4"
--finish#2.12

--start#2.13
UPDATE payments
SET payments.paymentDate = "2003-07-15"
WHERE payments.checkNumber = JM555205
--finish#2.13

--start#2.14
UPDATE payments
SET payments.paymentDate = "2003-07-15"
WHERE payments.checkNumber = JM555205
--finish#2.14


