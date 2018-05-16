SELECT E.firstName, E.lastName, E.email 
  FROM employees as E, offices as O 
 WHERE O.city = 'Boston' and E.officecode = O.officecode;