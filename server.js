// import packages and files here
const inquirer = require('inquirer');
const db = require('./db/connection');

// initiate a prompt using async/await 
const menu = async () => {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]);
    // using switch to run through various functions pertaining to assignment requirements
    switch (choice) {
        case 'View all departments':
            viewAllDepartments();
            break;
        case 'View all roles':
            viewAllRoles();
            break;
        case 'View all employees':
            viewAllEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        case 'Exit':
            db.end();
            // end after selection
            process.exit();
    }
};

// Function to view all departments
const viewAllDepartments = async () => {
    const res = await db.query('SELECT * FROM department');
    // selects all departments and shows as a row
    console.table(res.rows);
    // takes back to main menu
    menu();
};

// Function to view all roles
const viewAllRoles = async () => {
    const res = await db.query(`
        SELECT role.id, role.title, role.salary, department.name AS department 
        FROM role 
        JOIN department ON role.department_id = department.id
    `);
    console.table(res.rows);
    menu();
};

// Function to view all employees
const viewAllEmployees = async () => {
    // going to need to select all aspects of employee data then join the new role on the employee plus attributes of that role
    // section required help from xpert learning assistant
    const res = await db.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
               manager.first_name AS manager_first_name, manager.last_name AS manager_last_name 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    console.table(res.rows);
    menu();
};

// Function to add a department
const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the department name:'
        }
    ]);
    await db.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added ${name} to the database`);
    menu();
};

// Function to add a role
const addRole = async () => {
    const departments = await db.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(department => ({
        name: department.name,
        value: department.id
    }));

    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the role salary:'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department:',
            choices: departmentChoices
        }
    ]);
    await db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added ${title} to the database`);
    menu();
};

// Function to add an employee
const addEmployee = async () => {
    const roles = await db.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));

    const employees = await db.query('SELECT * FROM employee');
    const managerChoices = employees.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    }));
    managerChoices.unshift({ name: 'None', value: null });

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee\'s first name:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee\'s last name:'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role:',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager:',
            choices: managerChoices
        }
    ]);
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added ${first_name} ${last_name} to the database`);
    menu();
};

// Function to update an employee role
const updateEmployeeRole = async () => {
    // set variable of employee equal to the result of select all data from employee table
    const employees = await db.query('SELECT * FROM employee');
    // need to run through employee data and select - shows by first/last name and id
    const employeeChoices = employees.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    }));
    // then we want to select the new role for the given employee and update
    const roles = await db.query('SELECT * FROM role');
    // need to set a variable to role choices and map through those added to the database
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));

    const { employee_id, role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role:',
            choices: roleChoices
        }
    ]);
    await db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log(`Updated employee's role`);
    menu();
};

// Start the application by calling the menu function
menu();
