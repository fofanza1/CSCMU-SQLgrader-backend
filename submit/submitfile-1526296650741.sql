---------Quiz#2----------

--start#2.1
SELECT customers.customerName,customers.state,customers.city FROM customers WHERE customers.state LIKE "CA" AND customers.city LIKE "San francisco"
--finish#2.1

--start#2.2
SELECT offices.officeCode,offices.addressLine1,offices.addressLine2 FROM offices WHERE offices.addressLine2 is null 
--finish#2.2

--start#2.3
SELECT employees.firstName,employees.lastName,employees.email FROM employees,offices WHERE employees.officeCode=offices.officeCode AND offices.city="boston"
--finish#2.3

--start#2.4
SELECT customers.customerName,orders.orderDate FROM customers,orders WHERE orders.customerNumber=customers.customerNumber AND (orders.orderDate LIKE "2004-05%" OR orders.orderDate LIKE "2004-04%") ORDER BY orders.orderDate DESC 
--finish#2.4

--start#2.5
SELECT customers.customerNumber,customers.customerName FROM customers,orders WHERE customers.customerNumber != (customers.customerNumber = orders.customerNumber)
--finish#2.5

--start#2.6
SELECT employees.firstName,employees.lastName,offices.city,Supervisor.firstName,Supervisor.lastName,S_office.city FROM employees,employees AS Supervisor,offices,offices AS S_office WHERE (employees.officeCode=offices.officeCode AND Supervisor.officeCode = S_office.officeCode) AND S_office.city != offices.city AND employees.reportsTo=Supervisor.employeeNumber 
--finish#2.6

--start#2.7
SELECT MAX(products.buyPrice),MIN(products.buyPrice),MAX(products.quantityInStock) FROM products 
--finish#2.7

--start#2.8
SELECT orders.orderDate,products.productName,COUNT(orderdetails.quantityOrdered) FROM orders,products,orderdetails WHERE (orders.orderDate >= "2005-01-01" AND orders.orderDate<= "2005-01-10") GROUP BY products.productName ORDER BY COUNT(orderdetails.quantityOrdered) ASC 
--finish#2.8

--start#2.9
SELECT customers.customerName,SUM(products.buyPrice) FROM customers,orders,orderdetails,products WHERE (orderdetails.orderNumber,products.buyPrice(
SELECT orderdetails.orderNumber,(products.buyPrice*orderdetails.quantityOrdered) FROM orderdetails,products WHERE orderdetails.productCode=products.productCode)
(customers.customerNumber=orders.customerNumber AND orders.orderNumber=orderdetails.orderNumber AND orderdetails.productCode=products.productCode) GROUP BY customers.customerNumber HAVING SUM(products.buyPrice)>150000
--finish#2.9

--start#2.10
INSERT productlines(productlines.productLine,productlines.textDescription) VALUES ("Computer","Computer Notebook")
--finish#2.10

--start#2.11
DELETE FROM productlines WHERE productlines.productLine="Computer"
--finish#2.11

--start#2.12
UPDATE offices SET offices.addressLine2 ="Floor #4",offices.state ="MA" WHERE offices.officeCode=4
--finish#2.12

--start#2.13
UPDATE payments,orders SET payments.paymentDate="2003-07-15" WHERE payments.customerNumber=orders.customerNumber AND payments.checkNumber="JM555205"AND orders.orderDate="2003-05-20"
--finish#2.13

--start#2.14
UPDATE payments,orders SET payments.paymentDate="2003-07-15" WHERE payments.customerNumber=orders.customerNumber AND payments.checkNumber="JM555205"AND orders.orderDate="2003-05-20"
--finish#2.14

