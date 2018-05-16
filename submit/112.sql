---------Quiz#2----------

--start#2.1
SELECT customername,state,city FROM customers WHERE state = "CA" AND city = "San Francisco"
--finish#2.1

--start#2.2
SELECT officecode,addressline1,addressline2 FROM offices WHERE addressline2 is NULL
--finish#2.2

--start#2.3
SELECT Firstname,lastname,email FROM employees WHERE officeCode = 2
--finish#2.3

--start#2.4
SELECT customerName,orderDate FROM customers c,orders o WHERE c.customerNumber = o.customerNumber AND o.orderdate > "2004-04-01" AND o.orderdate < "2004-06-01" ORDER BY orderdate DESC
--finish#2.4

--start#2.5

--finish#2.5

--start#2.6

--finish#2.6

--start#2.7
SELECT MAX(buyPrice),MIN(buyPrice),MAX(quantityInStock) FROM `products` WHERE 1
--finish#2.7

--start#2.8

--finish#2.8

--start#2.9

--finish#2.9

--start#2.10
INSERT INTO productlines(productline,textdescription) VALUES("Computer","Computer Notebook")
--finish#2.10

--start#2.11
DELETE FROM productlines WHERE productline = "Computer"
--finish#2.11

--start#2.12
UPDATE offices SET addressline2 = "Floor#4" AND state = "MA" WHERE officecode = "4"
--finish#2.12

--start#2.13
UPDATE payments SET paymentdate = "2003-07-15" WHERE checknumber = "JM555205"
--finish#2.13

--start#2.14
UPDATE payments SET paymentdate = "2003-07-15" WHERE checknumber = "JM555205"
--finish#2.14

