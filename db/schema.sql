-- code provided on readme from week 12 challenge readme
-- creating database here
DROP DATABASE employee_db;
CREATE DATABASE employee_db;
-- checkout employee_db
\c employee_db
-- id and name
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
-- id, title, salary, dep_id - foreign key is dep_id
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);
-- foreign key and a reference in employee block
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER REFERENCES employee(id),
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL
);
