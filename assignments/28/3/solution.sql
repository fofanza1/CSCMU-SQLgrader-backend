SELECT E.FirstName, E.LastName, E.email 
  FROM employees as E, offices as O 
 WHERE O.City = 'Boston' and E.OfficeCode = O.OfficeCode;