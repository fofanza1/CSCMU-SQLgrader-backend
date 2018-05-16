SELECT Sum(Hours)
 FROM  works_on,  project
WHERE Pno = Pnumber and Pname LIKE 'Reorganization';