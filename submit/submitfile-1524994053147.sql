---------Quiz#2----------

--start#2.1
SELECT `customerName`,`state`,`city` FROM `customers` WHERE `state`='CA' AND `city`= 'San Francisco' 
--finish#2.1

--start#2.2
SELECT DISTINCT`officeCode`,offices.addressLine1,offices.addressLine2 FROM `offices`,`customers` WHERE offices.addressLine2 IS NULL
--finish#2.2

--start#2.3
SELECT DISTINCT `firstName`,`lastName`,`email` FROM `employees` WHERE `officeCode`= '2'
--finish#2.3

--start#2.4
SELECT `customerName`,`orderDate` FROM `customers`,`orders` WHERE `orderDate` BETWEEN '2004-05-01' AND '2004-04-01' ORDER BY `orderDate` DESC
--finish#2.4

--start#2.5
SELECT `customerNumber`,`customerName` FROM `customers` WHERE `creditLimit`='0' ORDER BY `customerNumber` 
--finish#2.5

--start#2.6
SELECT `firstName`,`lastName`,`city` FROM `employees`,`offices` WHERE 
--finish#2.6

--start#2.7

--finish#2.7

--start#2.8

--finish#2.8

--start#2.9

--finish#2.9

--start#2.10
INSERT INTO `productlines`
VALUES (Computer,Computer Notebook);
SELECT `productline`,`textDescription`
--finish#2.10

--start#2.11

--finish#2.11

--start#2.12

--finish#2.12

--start#2.13

--finish#2.13

--start#2.14

--finish#2.14

--start#2.15

--finish#2.15

