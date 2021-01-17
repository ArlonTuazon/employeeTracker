const mysql = require('mysql2');
//const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
//const validate = require('./javascript/validate');
const { response } = require('express');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'Prettynikka13',
  database: 'employees'
});
// connection.promise().query("SELECT 1")
//   .then( ([rows,fields]) => {
//     console.log(rows);
//   })
//   .catch(console.log)
//   .then( () => connection.end());

connection.connect((error) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`+++====================================================================================+++`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
    console.log(``);
    console.log(`   `+ chalk.blue.bgRed.bold('By: Arlon Tuazon'));
    console.log(``);
    console.log(chalk.yellow.bold(`+++====================================================================================+++`));
    promptUser();
  });

  // Prompt User for Choices
const promptUser = () => {
    inquirer.prompt([
        {
          name: 'choices',
          type: 'list',
          message: 'Please select an option:',
          choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'View All Employees By Department',
            'View All Employees By Manager',
            'View Department Budgets',
            'Update Employee Role',
            'Update Employee Manager',
            'Add Employee',
            'Add Role',
            'Add Department',
            'Remove Employee',
            'Remove Role',
            'Remove Department',
            'Exit'
            ]
        }
      ])
      .then((answers) => {
        const {choices} = answers;
  
          if (choices === 'View All Employees') {
              viewAllEmployees();
          }
  
          if (choices === 'View All Departments') {
            viewAllDepartments();
        }
  
          if (choices === 'View All Employees By Department') {
              viewEmployeesByDepartment();
          }
          if (choices === 'View All Employees By Manager') {
            viewEmployeesByManager();
        }
  
          if (choices === 'Add Employee') {
              addEmployee();
          }
  
          if (choices === 'Remove Employee') {
              removeEmployee();
          }
  
          if (choices === 'Update Employee Role') {
              updateEmployeeRole();
          }
  
          if (choices === 'Update Employee Manager') {
              updateEmployeeManager();
          }
  
          if (choices === 'View All Roles') {
              viewAllRoles();
          }
  
          if (choices === 'Add Role') {
              addRole();
          }
  
          if (choices === 'Remove Role') {
              removeRole();
          }
  
          if (choices === 'Add Department') {
              addDepartment();
          }
  
          if (choices === 'View Department Budgets') {
              viewDepartmentBudget();
          }
  
          if (choices === 'Remove Department') {
              removeDepartment();
          }
  
          if (choices === 'Exit') {
              connection.end();
          }
    });
  };
  
  //+++++++++++++++++ VIEW ++++++++++++++++

// View All Employees
const viewAllEmployees = () => {
    let sql =  `SELECT concat(e.first_name, ' ', e.last_name) 'Employee Name', d.name 'Department', r.title 'Role', r.salary 'Salary' ,IFNULL(concat(e2.first_name, ' ', e2.last_name),'None') 'Manager Name' from employee e left join role r on e.role_id = r.id left join department d on r.department_id = d.id left join employee e2 on e.manager_id = e2.id`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.log(`                              ` + chalk.green.bold(`Current Employees:`));
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.table(response);
      console.log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
    });
  };

  // View all Roles
const viewAllRoles = () => {
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    const sql =  `SELECT r.id 'Role ID', r.title 'Role Title', r.salary 'Role Salary', d.name 'Department', IFNULL(count(DISTINCT e.id),0) 'Employees Per Role' from role r left join employee e on r.id = e.role_id left join department d on r.department_id = d.id left join employee e2 on e.manager_id = e2.id group by r.id, r.title, r.salary;`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
  };
// View all Departments
const viewAllDepartments = () => {
    const sql =   `SELECT department.id 'Department ID', department.name 'Department Name', count(DISTINCT role.id) 'Role Count', count(distinct employee.id) 'Employee Count' from department left join role on department.id = role.department_id inner join employee on role.id = employee.role_id group by department.id, department.name;`; 
    connection.query(sql, (error, response) => {
      if (error) throw error;
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.log(`                              ` + chalk.green.bold(`All Departments:`));
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.table(response);
      console.log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
    });
  };
  // View all Employees by Department
const viewEmployeesByDepartment = () => {
    const sql =     `SELECT concat(employee.first_name, ' ', employee.last_name) 'Employee Name', 
                    department.name AS Department
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Employees by Department:`));
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
      });
  };

  // View all Employees by Manager
  const viewEmployeesByManager = () => {
    const sql =  `select distinct concat(e2.first_name, ' ', e2.last_name) 'ManagerName' from employee e left join employee e2 on e.manager_id = e2.id where e2.last_name is not null;`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Employees by Manager:`));
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
      });
  };

  //View all Departments by Budget
const viewDepartmentBudget = () => {
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    const sql = `select d.name 'Department', sum(r.salary) 'Utilized Budget' from department d left join role r on d.id = r.department_id group by d.name`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
  };
  
