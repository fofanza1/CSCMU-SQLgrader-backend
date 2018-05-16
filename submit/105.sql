---------Quiz#2----------

--start#2.1
SELECT customerName, state, city FROM customers WHERE state = "CA" AND city = "San Francisco"
--finish#2.1

--start#2.2
SELECT officeCode, addressLine1, addressLine2 FROM offices
--finish#2.2

--start#2.3
SELECT firstName, lastName, email FROM employees AS e JOIN offices AS o ON e.officeCode = o.officeCode WHERE city = "Boston"

--finish#2.3

--start#2.4
SELECT customerName, o.orderDate FROM customers AS c JOIN orders AS o ON c.customerNumber = o.customerNumber WHERE orderDate >"2004-3-31" AND orderDate <"2004-6-01" ORDER BY orderDate DESC
--finish#2.4

--start#2.5
SELECT customerNumber, customerName FROM customers WHERE customerNumber NOT IN (SELECT customerNumber FROM orders)
--finish#2.5

--start#2.6
SELECT e.firstName, e.lastName, oe.city, s.firstName, s.lastName, os.city FROM employees AS e JOIN offices AS oe ON e.officeCode = oe.officeCode JOIN employees AS s ON e.employeeNumber = s.reportsTo JOIN offices AS os ON s.officeCode = os.officeCode
--finish#2.6

--start#2.7
SELECT MAX(buyPrice) AS MAX_price, MIN(buyPrice) AS MIN_price, MAX(quantityInStock) AS MAX_Remain FROM products
--finish#2.7

--start#2.8
SELECT o.orderDate, p.productName, quantityOrdered FROM orderdetails AS od JOIN orders AS o ON od.orderNumber = o.orderNumber JOIN products AS p ON p.productCode = od.productCode WHERE o.orderDate >"2004-12-31" AND o.orderDate < "2005-1-10" ORDER BY quantityOrdered
--finish#2.8

--start#2.9

--finish#2.9

--start#2.10

--finish#2.10

--start#2.11

--finish#2.11

--start#2.12
UPDATE offices SET addressLine2 = "Floor #4", state = "MA" WHERE officeCode = 4
--finish#2.12

--start#2.13
UPDATE payments SET paymentDate = "2003-07-15" WHERE checkNumber = "JM555205"
--finish#2.13

--start#2.14
--finish#2.14

