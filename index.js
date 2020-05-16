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

    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        console.table("Employee By Deptartment List:", res);
    });
    start();
};



// ROLES TABLE FUNCTIONS
function allRolesSearch() {
    const query = "SELECT role.id, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        console.table("Role List:", res);
    });
    start();
};



// DEPARTMENTS TABLE FUNCTIONS
function allDeptsSearch() {
    const query = "SELECT department.id, department.name FROM department";
    connection.query(query, (err, res) => {
        console.table("Department List:", res);
    });
    start();
};



// QUIT FUNCTION
function quit() {

    connection.end(() => {
        console.table("CONNECTION CLOSED - HAVE A NICE DAY!");
    });

};
