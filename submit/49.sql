---------Assignment#2----------

--start#2.1
SELECT Fname, Minit, Lname
 FROM  employee
WHERE Salary > 30000;
--finish#2.1
SELECT Sum(Hours)
 FROM  works_on,  project
WHERE Pno = Pnumber and Pname LIKE 'Reorganization';
--start#2.2

--finish#2.2
INSERT INTO department VALUES('Accounting', 2, '222222200', '1980-06-01');
--start#2.3

--finish#2.3

--start#2.4
UPDATE employee, department
SET Salary = Salary + (Salary * 5 / 100)
WHERE  Dname = 'Research' and 
Salary < 30000 and Dno = Dnumber;
--finish#2.4

--start#2.5
DELETE 
FROM dept_locations
WHERE Dnumber = 5 and Dlocation = 'Sugarland';
--finish#2.5

--start#2.6
SELECT      Count(SSN) 
 FROM       employee
WHERE      Dno = 7;
--finish#2.6

