UPDATE employee, department
      SET Salary = Salary + (Salary * 5 / 100)
WHERE  Dname = 'Research' and 
            Salary < 30000 and Dno = Dnumber;
select * from employee where Dno = 5 and salary < 30000;