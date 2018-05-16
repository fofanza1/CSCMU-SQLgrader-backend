SELECT C.customerName, O.orderDate 
    FROM customers as C, orders as O 
   WHERE OrderDate >= '2004-04-01' and OrderDate <= '2004-05-31' and C.CustomerNumber = O.CustomerNumber
ORDER BY OrderDate DESC;