var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
require('dotenv').config();

console.log(process.env.DB_PASSWORD);

// const Deptartment = require("./lib/Department");
// const employee = require("./lib/employee");
// const Role = require("./lib/Role");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.DB_PASSWORD,
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});


function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Remove employee",
                "Update employee role",
                "Update employee manager",
                "View all roles",
                "Add a role",
                "Remove a role",
                "View all departments",
                "Add a department",
                "Remove a department",
                "Quit"

            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    allEmpsSearch();
                    break;

                case "View all employees by department":
                    empsByDeptSearch();
                    break;

                case "View all employees by manager":
                    empsByMgrSearch();
                    break;

                case "Add employee":
                    addEmp();
                    break;

                case "Remove employee":
                    removeEmp();
                    break;

                case "Update employee role":
                    updateEmpRole();
                    break;

                case "Update employee manager":
                    updateEmpMgr();
                    break;

                case "View all roles":
                    allRolesSearch();
                    break;

                case "Add a role":
                    addRole();
                    break;

                case "Remove a role":
                    removeRole();
                    break;

                case "View all departments":
                    allDeptsSearch();
                    break;

                case "Add a department":
                    addDept();
                    break;

                case "Remove a department":
                    removeDept();
                    break;

                case "Quit":
                    quit();
                    break;
            }
        });
};



// EMPLOYEE TABLE FUNCTIONS
function allEmpsSearch() {

    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        console.table("Employee List:", res);
    });
    start();
};

function empsByDeptSearch() {

    const query = "SELECT department.id, department.name, employee.first_name, employee.last_name, role.title FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id";
    connection.query(query, (err, res) => {
        console.table("Employee By Deptartment List:", res);
    });
    start();
};

function empsByMgrSearch() {

    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        console.table("Employee By Deptartment List:", res);
    });
    start();
};

function addEmp() {

    const query = "SELECT role.id, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, results) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the new employee's first name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the new employee's last name?"
                },
                {
                    name: "roleID",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];

                        console.log("Here are the role IDs. Make your choice below.")
                        console.table(results);
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id);
                        }
                        return choiceArray;
                    },
                    message: "What role will the employee be filling? (NOTE: If the role does not exist yet, choose 15 as a placeholder and then update it later.)"
                },
                {
                    name: "managerID",
                    type: "input",
                    message: "What is the ID of the new employee's manager? (Not sure yet? Enter 0 here and update it later.)",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {

                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_ID: answer.roleID || 15,
                        manager: answer.managerID || 0
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The new employee was successfully added to the employee database!");

                        start();
                    }
                );
            });
    });
};



// ROLES TABLE FUNCTIONS
function allRolesSearch() {
    const query = "SELECT role.id, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        console.table("Role List:", res);
    });
    start();
};

function addRole() {

    const query = "SELECT department.id, department.name FROM department";
    connection.query(query, (err, results) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title for the new role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary for the new role?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "deptID",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];

                        console.log("Here are the dept IDs. Make your choice below.")
                        console.table(results);
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id);
                        }
                        return choiceArray;
                    },

                    message: "What department is this role going? (NOTE: select 6 if you're unsure, and correct it later."
                }
            ])
            .then(function (answer) {

                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.deptID
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The new role was successfully added to the roles database!");

                        start();
                    }
                );
            });


    });


};






// DEPARTMENTS TABLE FUNCTIONS
function allDeptsSearch() {
    const query = "SELECT department.id, department.name FROM department";
    connection.query(query, (err, res) => {
        console.table("Department List:", res);
    });
    start();
};


function addDept() {


    inquirer
        .prompt([
            {
                name: "deptName",
                type: "input",
                message: "What is the name of the new department that you're adding?"
            }
        ])
        .then(function (answer) {

            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.deptName
                },
                function (err) {
                    if (err) throw err;
                    console.log("The new department was successfully added to the department database!");

                    start();
                }
            );
        });
};


// QUIT FUNCTION
function quit() {

    connection.end(() => {
        console.table("CONNECTION CLOSED - HAVE A NICE DAY!");
    });

};
