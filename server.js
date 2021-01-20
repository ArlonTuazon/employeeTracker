const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
const { response } = require('express');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: '',
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
              deleteEmployee();
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
              deleteRole();
          }
  
          if (choices === 'Add Department') {
              addDepartment();
          }
  
          if (choices === 'View Department Budgets') {
              viewDepartmentBudget();
          }
  
          if (choices === 'Remove Department') {
              deleteDepartment();
          }
  
          if (choices === 'Exit') {
              connection.end();
          }
    });
  };
  
  //+++++++++++++++++ VIEW ++++++++++++++++

// View All Employees
const viewAllEmployees = () => {
     connection.query(`SELECT concat(e.first_name, ' ', e.last_name) 'Employee Name', 
                        d.name 'Department', r.title 'Role', r.salary 'Salary' ,
                        IFNULL(concat(e2.first_name, ' ', e2.last_name),'None') 'Manager Name' FROM employee e
                        LEFT JOIN role r on e.role_id = r.id LEFT JOIN department d on r.department_id = d.id 
                        LEFT JOIN employee e2 on e.manager_id = e2.id`,
     (error, response) => {
      if (error) throw error;
      console.log(chalk.yellow.bold(`+++==============================================================================+++`));
      console.log(`                              ` + chalk.green.bold(`Current Employees:`));
      console.log(chalk.yellow.bold(`+++==============================================================================+++`));
      console.table(response);
      console.log(chalk.yellow.bold(`+++==============================================================================+++`));
      promptUser();
    });
  };

  // View all Roles
const viewAllRoles = () => {
    console.log(chalk.yellow.bold(`+++=============================================================================+++`));
    console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
    console.log(chalk.yellow.bold(`+++==============================================================================+++`));
    
    connection.query(`SELECT r.id 'Role ID', r.title 'Role Title', 
                      r.salary 'Role Salary', d.name 'Department', 
                      IFNULL(count(DISTINCT e.id),0) 'Employees Per Role' from role r 
                      LEFT JOIN employee e on r.id = e.role_id 
                      LEFT JOIN department d on r.department_id = d.id left join employee e2 on e.manager_id = e2.id group by r.id, r.title, r.salary;`, 
      (error, response) => {
      if (error) throw error;
        console.table(response);
        console.log(chalk.yellow.bold(`+++==============================================================================+++`));
        promptUser();
    });
  };
// View all Departments
const viewAllDepartments = () => {
      connection.query(`SELECT department.id 'Department ID', department.name 'Department Name', 
                      count(DISTINCT role.id) 'Role Count', count(distinct employee.id) 'Employee Count' 
                      FROM department LEFT JOIN role on department.id = role.department_id 
                      INNER JOIN employee on role.id = employee.role_id 
                      GROUP by department.id, department.name;`, (error, response) => {
      if (error) throw error;
      console.log(chalk.yellow.bold(`+++==============================================================================+++`));
      console.log(`                              ` + chalk.green.bold(`All Departments:`));
      console.log(chalk.yellow.bold(`+++==============================================================================+++`));
      console.table(response);
      console.log(chalk.yellow.bold(`+++==============================================================================+++`));
      promptUser();
    });
  };
  // View all Employees by Department
const viewEmployeesByDepartment = () => {
    connection.query(`SELECT concat(employee.first_name, ' ', employee.last_name) 'Employee Name', 
                      department.name 'Department'
                      FROM employee 
                      LEFT JOIN role ON employee.role_id = role.id 
                      LEFT JOIN department ON role.department_id = department.id`, 
      (error, response) => {
      if (error) throw error;
        console.log(chalk.yellow.bold(`+++==============================================================================+++`));
        console.log(`                              ` + chalk.green.bold(`Employees by Department:`));
        console.log(chalk.yellow.bold(`+++==============================================================================+++`));
        console.table(response);
        console.log(chalk.yellow.bold(`+++==============================================================================+++`));
        promptUser();
      });
  };

  // View all Employees by Manager
  const viewEmployeesByManager = () => {
      connection.query(`SELECT concat(e.first_name, ' ', e.last_name) 'Employee Name', 
                        IFNULL(concat(e2.first_name, ' ', e2.last_name),'None') 'Manager Name' FROM employee e
                        LEFT JOIN employee e2 on e.manager_id = e2.id 
                        ORDER BY e.role_id ASC`, 
      (error, response) => {
      if (error) throw error;
        console.log(chalk.yellow.bold(`+++==============================================================================+++`));
        console.log(`                              ` + chalk.green.bold(`Employees by Manager:`));
        console.log(chalk.yellow.bold(`+++==============================================================================+++`));
        console.table(response);
        console.log(chalk.yellow.bold(`+++==============================================================================+++`));
        promptUser();
      });
  };

  //View all Departments by Budget
const viewDepartmentBudget = () => {
    console.log(chalk.yellow.bold(`+++==============================================================================+++`));
    console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
    console.log(chalk.yellow.bold(`+++==============================================================================+++`));
    connection.query(`SELECT d.name 'Department', sum(r.salary) 'Utilized Budget' 
                      FROM department d left join role r on d.id = r.department_id 
                      GROUP BY d.name`, (error, response) => {
      if (error) throw error;
        console.table(response);
        console.log(chalk.yellow.bold(`+++==============================================================================+++`));
        promptUser();
    });
  };

 //+++++++++++++++++ ADD ++++++++++++++++

// Add a New Employee
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const crit = [answer.fistName, answer.lastName]
      connection.query(`SELECT role.id, role.title FROM role`, (error, data) => {
      if (error) throw error; 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              crit.push(role);
              //const managerSql =  `SELECT * FROM employee`;
              connection.query(`SELECT * FROM employee`, (error, data) => {
                if (error) throw error;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    crit.push(manager);
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                      VALUES (?, ?, ?, ?)`, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")
                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
};

// Add a New Role
const addRole = () => {
    connection.query('SELECT * FROM department', (error, response) => {
      if (error) throw error;
      let deptNamesArray = [];
      response.forEach((department) => {deptNamesArray.push(department.name);});
      deptNamesArray.push('Create Department');
      inquirer
        .prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: deptNamesArray
          }
        ])
        .then((answer) => {
          if (answer.departmentName === 'Create Department') {
            addDepartment();
          } else {
            addRoleResume(answer);
          }
        });

      const addRoleResume = (departmentData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of your new role?',
              validate: newroles => {
                if (newroles) {
                  return true;
                }
                else {
                  console.log ('Please Enter New Role!')
                  return false;
                }
              }
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?',
              validate: newsalary => {
                if (isNaN(newsalary)) {
                  return 'Please enter a number!'
                }
                  return true
              }
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            response.forEach((department) => {
              if (departmentData.departmentName === department.name) {departmentId = department.id;}
            });

            let crit = [createdRole, answer.salary, departmentId];

            connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, crit, (error) => {
              if (error) throw error;
              console.log(chalk.yellow.bold(`+++==============================================================================+++`));
              console.log(chalk.greenBright(`Role successfully created!`));
              console.log(chalk.yellow.bold(`+++==============================================================================+++`));
              viewAllRoles();
            });
          });
      };
    });
  };


  // Add a New Department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
        validate: newDept => {
          if (newDept) {
            return true;
          }
          else {
            console.log ('Please Enter New Department!')
            return false;
          }
        }
      }
    ])
    .then((answer) => {
      connection.query(`INSERT INTO department (name) VALUES (?)`, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(``);
        console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
        console.log(``);
        viewAllDepartments();
      });
    });
};

 //+++++++++++++++++ UPDATE ++++++++++++++++

 // Update an Employee's Role
const updateEmployeeRole = () => {
   connection.query(`SELECT  employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`, 
    (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    connection.query(`SELECT role.id, role.title FROM role`, (error, response) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((role) => {rolesArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new role?',
            choices: employeeNamesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'What is their new role?',
            choices: rolesArray
          }
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          connection.query(`UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`,[newTitleId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(chalk.greenBright.bold(`+++==============================================================================+++`));
              console.log(chalk.greenBright(`Employee Role Updated`));
              console.log(chalk.greenBright.bold(`+++==============================================================================+++`));
              promptUser();
            }
          );
        });
    });
  });
};

// Update an Employee's Manager
const updateEmployeeManager = () => {
   connection.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
                     FROM employee`,
    (error, response) => {
    let employeeNamesArray = [];
    response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee has a new manager?',
          choices: employeeNamesArray
        },
        {
          name: 'newManager',
          type: 'list',
          message: 'Who is their manager?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId, managerId;
        response.forEach((employee) => {
          if (
            answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }

          if (
            answer.newManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });

        if (answer.chosenEmployee === answer.newManager) {
          console.log(chalk.redBright.bold(`+++==============================================================================+++`));
          console.log(chalk.redBright(`Invalid Manager Selection`));
          console.log(chalk.redBright.bold(`+++==============================================================================+++`));
          promptUser();
        } else {
         
          connection.query(`UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`, [managerId, employeeId],
              (error) => {
              if (error) throw error;
              console.log(chalk.greenBright.bold(`+++==============================================================================+++`));
              console.log(chalk.greenBright(`Employee Manager Updated`));
              console.log(chalk.greenBright.bold(`+++==============================================================================+++`));
              promptUser();
            }
          );
        }
      });
  });
};

//+++++++++++++++++ DELETE ++++++++++++++++
// Delete an Employee
const deleteEmployee = () => {
  
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name from employee;`, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    inquirer
      .prompt([
        {
          name: 'delEmployee',
          type: 'list',
          message: 'Which employee would you like to remove?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId;

        response.forEach((employee) => {
          if (
            answer.delEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }
        });

        connection.query(`DELETE FROM employee WHERE employee.id = ?`, [employeeId], (error) => {
          if (error) throw error;
          console.log(chalk.redBright.bold(`+++==============================================================================+++`));
          console.log(chalk.redBright(`Employee Successfully Removed`));
          console.log(chalk.redBright.bold(`+++==============================================================================+++`));
          viewAllEmployees();
        });
      });
  });
};

const deleteRole = () => {
    
  connection.query(`SELECT role.id, role.title FROM role`, (error, response) => {
    if (error) throw error;
    let roleNamesArray = [];
    response.forEach((role) => {roleNamesArray.push(role.title);});

    inquirer
      .prompt([
        {
          name: 'chosenRole',
          type: 'list',
          message: 'Which role would you like to remove?',
          choices: roleNamesArray
        }
      ])
      .then((answer) => {
        let roleId;

        response.forEach((role) => {
          if (answer.chosenRole === role.title) {
            roleId = role.id;
          }
        });

          connection.query(`DELETE FROM role WHERE role.id = ?`, [roleId], (error) => {
          if (error) throw error;
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.greenBright(`Role Successfully Removed`));
          console.log(chalk.redBright.bold(`====================================================================================`));
          viewAllRoles();
        });
      });
  });
};
// Delete a Department
const deleteDepartment = () => {
    
  connection.query(`SELECT department.id, department.name FROM department`, (error, response) => {
    if (error) throw error;
    let departmentNamesArray = [];
    response.forEach((department) => {departmentNamesArray.push(department.name);});

    inquirer
      .prompt([
        {
          name: 'chosenDept',
          type: 'list',
          message: 'Which department would you like to remove?',
          choices: departmentNamesArray
        }
      ])
      .then((answer) => {
        let departmentId;

        response.forEach((department) => {
          if (answer.chosenDept === department.name) {
            departmentId = department.id;
          }
        });

        connection.query(`DELETE FROM department WHERE department.id = ?`, [departmentId], (error) => {
          if (error) throw error;
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.redBright(`Department Successfully Removed`));
          console.log(chalk.redBright.bold(`====================================================================================`));
          viewAllDepartments();
        });
      });
  });
};