USE employees;

INSERT INTO 
    department (name)
VALUES
    ('Executive'),
    ('Marketing'),
    ('Sales'),
    ('IT');

INSERT INTO 
    role (title, salary, department_id)
VALUES
    ('CEO', 150000, 1),
    ('VP IT', 100000, 2),
    ('VP Marketing', 85000, 3),
    ('VP Sales', 95000, 4),
    ('Marketing Manager', 60000, 3),
    ('Sales Manager', 70000, 4),
    ('IT Specialist', 90000, 2),
    ('Executive Assistant', 55000, 1);

INSERT INTO 
    employee (first_name, last_name, manager_id, role_id)
VALUES
    ('Julio', 'Tuazon', null, 1),
    ('Eric', 'Peterson', 1, 2),
    ('Giana', 'Smith', 1, 3),
    ('Jessica', 'Anderson', 1, 4),
    ('Emma', 'Sanchez', 1, 5),
    ('John', 'Parker', 3, 6),
    ('Rizza', 'Guzman', 2, 7),
    ('Nicole', 'Andes', 3, 8);






