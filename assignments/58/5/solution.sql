SELECT C.customerNumber, C.customerName
  FROM customers C
 WHERE NOT EXISTS (SELECT customerNumber 
                     FROM orders O 
                    WHERE C.customerNumber = O.customerNumber);