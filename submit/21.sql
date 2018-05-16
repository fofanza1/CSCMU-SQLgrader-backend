---------Assignment#2----------

--start#2.1
SELECT customerName, state, city 
  FROM customers 
 Where State = 'CA' and City = 'San Francisco';
--finish#2.1

--start#2.2
SELECT officeCode, addressLine1, addressLine2 
  FROM offices 
 WHERE addressline2 is NULL;
--finish#2.2

--start#2.3
SELECT E.firstName, E.lastName, E.email 
  FROM employees as E, offices as O 
 WHERE O.City = 'Boston' and E.OfficeCode = O.OfficeCode;
--finish#2.3

--start#2.4
SELECT C.customerName, O.orderDate 
    FROM customers as C, orders as O 
   WHERE OrderDate >= '2004-04-01' and OrderDate <= '2004-05-31' and C.CustomerNumber = O.CustomerNumber
ORDER BY OrderDate DESC;
--finish#2.4

--start#2.5
SELECT C.customerNumber, C.customerName
  FROM customers C
 WHERE NOT EXISTS (SELECT customerNumber 
                     FROM orders O 
                    WHERE C.customerNumber = O.customerNumber);
--finish#2.5

--start#2.6
SELECT E1.firstName, E1.lastName, O1.city, E2.firstName AS Supervisor_FirstName, 
       E2.lastName AS Supervisor_LastName, O2.city AS Supervisor_City
  FROM employees E1, employees E2, offices O1, offices O2
 WHERE E1.reportsTo = E2.employeeNumber AND E1.officeCode = O1.officeCode AND 
       E2.officeCode = O2.officeCode AND O1.city != O2.city;
--finish#2.6

--start#2.7
SELECT MAX(buyPrice) AS MAX_Price, MIN(buyPrice) AS MIN_Price, MAX(quantityInStock) AS MAX_Remain
  FROM products;
--finish#2.7

--start#2.8
SELECT O.orderDate, P.productName, SUM( OD.quantityOrdered ) AS Total_Quantity FROM products P, orders O, orderdetails OD WHERE P.productCode = OD.productCode AND OD.orderNumber = O.orderNumber AND O.orderDate >= '2005-01-01' AND O.orderDate < '2005-01-10' GROUP BY O.orderDate, P.productName ORDER BY SUM(OD.quantityOrdered);
--finish#2.8

--start#2.9
SELECT C.customerName, SUM(OD.quantityOrdered*OD.priceEach) AS Total_Price FROM customers C, orders O, orderdetails OD WHERE C.customerNumber = O.customerNumber and O.orderNumber = OD.orderNumber GROUP BY C.customerName HAVING SUM(OD.quantityOrdered*OD.priceEach) > 150000 ORDER BY SUM(OD.quantityOrdered*OD.priceEach) DESC;
--finish#2.9

--start#2.10
  Insert Into productlines values ( 'Computer', 'Computer Notebook', Null, Null);
--finish#2.10

--start#2.11
delete from productlines where productline = 'Computer';
--finish#2.11

--start#2.12
UPDATE offices SET addressLine2 = 'Floor #4', state = 'MA' WHERE officeCode = '4'; 
--finish#2.12

--start#2.13
UPDATE payments P, customers C, orders O
   SET paymentDate = '2003-07-15'
 WHERE C.customerName = 'Atelier graphique' and P.checkNumber = 'JM555205' and O.orderDate = '2003-05-20' and
       C.customerNumber = P.customerNumber and P.customerNumber = O.customerNumber;

--finish#2.13

--start#2.14
UPDATE payments P, customers C, orders O
   SET paymentDate = '2003-07-15'
 WHERE C.customerName = 'Atelier graphique' and P.checkNumber = 'JM555205' and O.orderDate = '2003-05-20' and
       C.customerNumber = P.customerNumber and P.customerNumber = O.customerNumber;
--finish#2.14

--start#2.13
UPDATE payments,orders SET payments.paymentDate="2003-07-15" WHERE payments.customerNumber=orders.customerNumber AND payments.checkNumber="JM555205"AND orders.orderDate="2003-05-20"
--finish#2.13

