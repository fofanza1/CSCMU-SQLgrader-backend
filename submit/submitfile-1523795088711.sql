---------Assignment#3----------

--start#3.1
INSERT INTO employee VALUES ("Evan","E","Wallis","987654320","1958-01-16","134 Pelham, Milwaukee, WI","M","92000.00",null,"7");
select * from employee where ssn="987654320";
--finish#3.1
	
--start#3.2
	select cast(salary as decimal(10,2)) from employee;
--finish#3.2

--start#3.3
	select * from works_on;
--finish#3.3

