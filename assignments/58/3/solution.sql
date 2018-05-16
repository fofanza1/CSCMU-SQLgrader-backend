SELECT E.firstName, E.lastName, E.email 
  FROM employees as E, offices as O 
 WHERE O.City = 'Boston' and E.OfficeCode = O.OfficeCode;