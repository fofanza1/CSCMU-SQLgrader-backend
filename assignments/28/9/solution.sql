SELECT C.customerName, SUM(OD.quantityOrdered*OD.priceEach) AS Total_Price FROM customers C, orders O, orderdetails OD WHERE C.customerNumber = O.customerNumber and O.orderNumber = OD.orderNumber GROUP BY C.customerName HAVING SUM(OD.quantityOrdered*OD.priceEach) > 150000 ORDER BY SUM(OD.quantityOrdered*OD.priceEach) DESC;