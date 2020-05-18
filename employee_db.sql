ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'process.env.DB_PASSWORD';
	
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;


CREATE TABLE department
(
id int AUTO_INCREMENT NOT NULL,
  name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

  CREATE TABLE role
  (
  id int AUTO_INCREMENT NOT NULL,	
  title varchar(30) NOT NULL,
  salary DECIMAL(10,4),
  department_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(department_id) REFERENCES department(id)
);

    CREATE TABLE employee
    (
      id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INT NOT NULL,
  manager INT REFERENCES employee(id),
  PRIMARY KEY(id),
  FOREIGN KEY(role_id) REFERENCES role(id)
);
