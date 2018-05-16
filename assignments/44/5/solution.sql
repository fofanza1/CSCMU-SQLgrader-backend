DELETE 
  FROM dept_locations
 WHERE Dnumber = 5 and 
            Dlocation = 'Sugarland' returning *;