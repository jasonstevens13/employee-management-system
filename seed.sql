USE employee_db;

INSERT INTO department (name)
VALUES ("Sales"),("Quality Assurace"),("Engineering"),("Information Technology"),("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Director of Sales", 150000, 1),("Sales Associate", 50000, 1),("Lead Generator", 40000, 1),("Director of QA", 85000, 2),
("QA Associate", 40000, 2),("Senior Engineer", 100000, 3),("Junior Engineer", 60000, 3),("Director of Engineering", 150000, 3),
("Director IT", 170000, 4),("Desktop Support Associate", 55000, 4),("Director of Marketing", 95000, 5),("Marketing Associate", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager)
VALUES ("Bob", "Smith", 1, 0),("Casey", "Mix", 2, 1),("John", "Doe", 3, 1),("Sally", "Jesse", 4, 0),("Judge", "Judy", 5, 2),("Will", "Smith", 6, 3),("Buford", "Simpson", 7, 3),("Kyle", "Wright", 8, 0),("Caitlin", "Messaros", 9, 0),("Sharon", "Rothwell", 10, 4),("Jordi", "Fish", 11, 0),("Sheila", "Little", 12, 5);
