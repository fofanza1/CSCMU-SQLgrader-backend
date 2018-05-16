SELECT E1.firstName, E1.lastName, O1.city, E2.firstName AS Supervisor_FirstName, 
       E2.lastName AS Supervisor_LastName, O2.city AS Supervisor_City
  FROM employees E1, employees E2, offices O1, offices O2
 WHERE E1.reportsTo = E2.employeeNumber AND E1.officeCode = O1.officeCode AND 
       E2.officeCode = O2.officeCode AND O1.city != O2.city;