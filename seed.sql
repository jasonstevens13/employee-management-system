USE employee_db;


INSERT INTO department (name)
VALUES ("Sales"),("Quality Assurace"),("Engineering"),("Information Technology"),("Marketing"),("Placeholder");

INSERT INTO role (title, salary, department_id)
VALUES ("Director of Sales", 150000, 1),("Sales Associate", 50000, 1),("Lead Generator", 40000, 1),("Director of QA", 85000, 2),
("QA Associate", 40000, 2),("Senior Engineer", 100000, 3),("Junior Engineer", 60000, 3),("Director of Engineering", 150000, 3),
("Director IT", 170000, 4),("Desktop Support Associate", 55000, 4),("Director of Marketing", 95000, 5),("Marketing Associate", 50000, 5),("Placeholder", 0, 6);

INSERT INTO employee (first_name, last_name, role_id, manager)
VALUES ("Bob", "Smith", 1, null),("Casey", "Mix", 2, 1),("John", "Doe", 3, 1),("Sally", "Jesse", 4, null),("Judge", "Judy", 5, 4),("Will", "Smith", 6, 8),("Buford", "Simpson", 7, 8),("Kyle", "Wright", 8, null),("Caitlin", "Messaros", 9, null),("Sharon", "Rothwell", 10, 9),("Jordi", "Fish", 11, null),("Sheila", "Little", 12, 11);
