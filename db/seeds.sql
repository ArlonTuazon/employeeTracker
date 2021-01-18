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
    ('VP IT', 100000, 4),
    ('VP Marketing', 85000, 2),
    ('VP Sales', 95000, 3),
    ('Marketing Manager', 60000, 2),
    ('Sales Manager', 70000, 3),
    ('IT Specialist', 90000, 4),
    ('Executive Assistant', 55000, 1);

INSERT INTO 
    employee (first_name, last_name, manager_id, role_id)
VALUES
    ('Julio', 'Tuazon', null, 1),
    ('Eric', 'Peterson', 1, 2),
    ('Giana', 'Smith', 1, 3),
    ('Jessica', 'Anderson', 1, 4),
    ('Emma', 'Sanchez', 3, 5),
    ('John', 'Parker', 4, 6),
    ('Rizza', 'Guzman', 2, 7),
    ('Nicole', 'Andes', 1, 8);






