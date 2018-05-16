---------Quiz#2----------

--start#2.1
SELECT customerName,`city`,`state`
FROM `customers` 
WHERE city = "Sanfrancisco" AND state = "CA"
--finish#2.1

--start#2.2
SELECT `officeCode`,`addressLine1`,`addressLine2`
FROM offices
WHERE addressLine2 = null
--finish#2.2

--start#2.3
SELECT `firstName`,`lastName`,`email`
FROM employees e,offices o
WHERE e.officeCode = o.officeCode and city = "Boston"
--finish#2.3

--start#2.4

--finish#2.4

--start#2.5
SELECT `customerName`
FROM    customers LEFT OUTER JOIN orders
ON customers.customerNumber = orders.customerNumber
--finish#2.5

--start#2.6

--finish#2.6

--start#2.7

--finish#2.7

--start#2.8

--finish#2.8

--start#2.9
SELECT SUM(amount),customerName 
FROM payments p, customers c 
WHERE amount > 150000 and p.customerNumber = c.customerNumber
--finish#2.9

--start#2.10
UPDATE offices
	SET addressLine2 = "floor#4",state = "MA"
WHERE officeCode = 4    
--finish#2.10

--start#2.11
DELETE productlines
FROM productlines
WHERE productline = "Computer" AND textDescription = "Computer Notebook"

--finish#2.11

--start#2.12
UPDATE offices
	SET addressLine2 = "floor#4",state = "MA"
WHERE officeCode = 4    

--finish#2.12

--start#2.13
UPDATE payments,customers
	SET paymentDate = 2003-07-15
WHERE customerName = "Atelier graphique" and checkNumber = "JM555205"AND payments.customerNumber = customers.customerNumber

--finish#2.13

--start#2.14

--finish#2.14


