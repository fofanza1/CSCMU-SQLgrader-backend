
use testda;

CREATE TABLE users (
	id INT CHECK (id > 0) IDENTITY PRIMARY KEY, 
	firstname VARCHAR(30) NOT NULL,
	lastname VARCHAR(30) NOT NULL,
	email VARCHAR(50) NOT NULL,
	age INT,
	location VARCHAR(50),
	date DATETIME2(0)
);
