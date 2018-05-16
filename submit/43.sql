---------Quiz#2----------

--start#2.1
SELECT CustomerName ,state ,city  
FROM `customers` 
WHERE `city` LIKE 'San Francisco' AND `state` LIKE 'CA'
--finish#2.1

--start#2.2
SELECT officecode, addressLine1, addressLine2 FROM `offices` WHERE `addressLine2` IS NULL 
--finish#2.2

--start#2.3
SELECT firstname, lastname, email FROM `employees` WHERE `officeCode` LIKE '2' 
--finish#2.3

--start#2.4
SELECT customername,orderdate FROM `orders`,`customers` 
WHERE `orderDate` BETWEEN '2004-04-01' 
AND '2004-05-31' and orders.customerNumber = customers.customerNumber 
ORDER BY `orderdate` DESC 
--finish#2.4

--start#2.5

--finish#2.5

--start#2.6
SELECT e.firstname, e.lastname, e.city,m.firstName, m.lastName,m.city
FROM employees e, employees m, offices o
WHERE m.jobTitle LIKE '%manager%' and e.city != m.city
--finish#2.6

--start#2.7
SELECT MAX(buyPrice)as MAX_Price,MIN(buyPrice)as MIN_Price,MAX(quantityInStock)as MAX_Remain 
FROM `products` 
--finish#2.7

--start#2.8
SELECT orderdate as OrderDate, productname as ProductName, quantityOrdered as Total_Quantity 
FROM orders o, orderdetails od, products p WHERE `orderDate` BETWEEN '2005-01-01' AND '2005-01-09' 
AND o.orderNumber = od.orderNumber 
AND od.productCode = p.productCode 
ORDER BY `od`.`quantityOrdered` ASC 
--finish#2.8

--start#2.9

--finish#2.9

--start#2.10
INSERT INTO `productlines` (`productLine`, `textDescription`, `htmlDescription`, `image`) VALUES ('Computer', 'Computer Notebook', NULL, NULL);
--finish#2.10

--start#2.11
DELETE FROM `productlines` WHERE productline = 'Computer' 
--finish#2.11

--start#2.12
UPDATE offices SET addressLine2 = 'Floor #4', state = 'MA' WHERE officeCode = 4 
--finish#2.12

--start#2.13

--finish#2.13

--start#2.14

--finish#2.14

