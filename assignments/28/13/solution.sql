UPDATE payments P, customers C, orders O
   SET paymentDate = '2003-07-15'
 WHERE C.customerName = 'Atelier graphique' and P.checkNumber = 'JM555205' and O.orderDate = '2003-05-20' and
       C.customerNumber = P.customerNumber and P.customerNumber = O.customerNumber;
SELECT C.customerNumber, C.customerName, P.checkNumber, O.orderDate, P.PaymentDate
  FROM payments P, customers C, orders O
 WHERE C.customerName = 'Atelier graphique' AND P.checkNumber = 'JM555205' AND paymentDate = '2003-07-15' AND
       O.orderDate = '2003-05-20' AND C.customerNumber = P.customerNumber AND P.customerNumber = O.customerNumber;