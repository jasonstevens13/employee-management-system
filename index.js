// pull in required npms
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
require('dotenv').config();

// The following 3 comments will be needed when I modularize functions for each of the 3 sql tables...these will refer the the currently unused files in ./lib folder.

// const deptartment = require("./lib/Department");
// const employee = require("./lib/employee");
// const role = require("./lib/Role");

// mysq database info
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

// Making the connection to the sql databse here and then immediately starting the application with my start() function.
connection.connect(function (err) {
    if (err) throw err;
    start();
});

// The start function below immediatly prompts the user to ask what action he/she would like to take. 
// Notice that I plan to add some options/feature in the future, so for now they are commented out 9e.g. Remove Employee.
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
                // "Remove employee",
                "Update employee role",
                // "Update employee manager",
                "View all roles",
                "Add a role",
                // "Remove a role",
                "View all departments",
                "Add a department",
                // "Remove a department",
                "Quit"

            ]
        })

        // Depending on the selection action about, a respective function is called (e.g. allEmpsSearch)
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

                // case "Remove employee":
                //     removeEmp();
                //     break;

                case "Update employee role":
                    updateEmpRole();
                    break;

                // case "Update employee manager":
                //     updateEmpMgr();
                //     break;

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

                // case "Remove a department":
                //     removeDept();
                //     break;

                case "Quit":
                    quit();
                    break;
            }
        });
};


// Reminder - the sql database contains 3 tables of data - one for employees, one for roles, and one for departments.
// I have separated groupings of functions as to what primary table they relate to; however in future these will
// be modularized into those three unsued js files labeled for each each respective table in the /lib folder.





// EMPLOYEE TABLE FUNCTIONS

// This function sends a sql query to the database - obtains the employee table, and makes two joins to 
// the role and department tables
function allEmpsSearch() {

    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        console.table("Employee List:", res);
    });
    start();
};

// empsByDeptSearch queries the dept table, but joins the role and employee tables and presents 
// the results in oder of dept because that is the primary table
function empsByDeptSearch() {

    const query = "SELECT department.id, department.name, employee.first_name, employee.last_name, role.title FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id";
    connection.query(query, (err, res) => {
        console.table("Employee By Deptartment List:", res);
    });
    start();
};

// empsByMgrSearch queries employee table and joins role and department tables; column for manager is made available
function empsByMgrSearch() {

    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        console.table("Employee By Deptartment List:", res);
    });
    start();
};

// addEmp makes a sql query to the role table with dept table joined - the results are then used during the
// comman line promts that follow. The user is asked for the first and last name strings, then asks what role
// the new employee will fulfill - this is where the sql query results are presented as choices for the user.
// The user is then prompted for a manager ID and the input is only accepted if it is a number (checked with NaN).
// Once all prompts are fulfilled the final sql INSERT command is sent to the databse.
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



// updateEmpRole makes 3 queries. The first presents the emp list to allow easy access to the employee IDs,
// from which the user must select the emp to update. The same is done with the role table list.
// Finally the third and final sql query takes the values gathered from the first two prompts and updates
// the selected employee's role ID.
function updateEmpRole() {
    // query the database for all employees to choose which employee is receiving an update to their role

    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
    let query2 = "SELECT role.id, role.title, role.salary FROM role";
    let query3 = "UPDATE employee SET role_id = ? WHERE employee.id = ?";
    let chosenEmpID;
    let chosenRoleID;
    let choiceArray = [];
    let choiceArray2 = [];

    connection.query(query, (err, results) => {
        if (err) throw err;
        // once you have the emp list, prompt the user for which emp they'd like to update by showing list with IDs.
        inquirer
            .prompt([

                {
                    name: "empID",
                    type: "list",
                    choices: function () {

                        console.log("Employee List: ")
                        console.table(results);
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id);
                        }
                        return choiceArray;
                    },

                    message: "Select the employee ID for who is is getting an updated role."
                }
            ])
            .then(function (answer) {

                // get the information of the chosen item

                chosenEmpID = answer;

                connection.query(query2, (err, results2) => {
                    if (err) throw err;

                    inquirer
                        .prompt([

                            {
                                name: "newRoleID",
                                type: "rawlist",
                                choices: function () {

                                    console.log("Role List: ")
                                    console.table(results2);
                                    for (var i = 0; i < results2.length; i++) {
                                        choiceArray2.push(results2[i].id);
                                    }
                                    return choiceArray2;
                                },

                                message: "What is the new role ID you will be asigning this employee?"
                            }
                        ])
                        .then(function (answer2) {

                            chosenRoleID = answer2;

                            console.log(chosenRoleID);
                            console.log(chosenEmpID);

                            connection.query(
                                query3,
                                [
                                    chosenRoleID.newRoleID,
                                    chosenEmpID.empID

                                ],
                                function (err, results3) {
                                    if (err) throw err;
                                    console.log("Employee role updted successfully!");
                                    start();
                                }
                            );
                        });
                });
            });
    });
};







// ROLES TABLE FUNCTIONS


// allRolesSearch queries the role table while joining the department table
function allRolesSearch() {
    const query = "SELECT role.id, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id";
    connection.query(query, (err, res) => {
        console.table("Role List:", res);
    });
    start();
};

// addRole function queries the dept table to later use in a prompt
// The user is then prompted for the new role's title and salary.
// The user is provided a list of dept IDs from the original dept table query
// Finally a sql INSERT command is executed with all of the given data - the new role is added to the table.
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


// allDeptsSearch simply queries the dept table with no joins
function allDeptsSearch() {
    const query = "SELECT department.id, department.name FROM department";
    connection.query(query, (err, res) => {
        console.table("Department List:", res);
    });
    start();
};

// addDept prompts the user for the new dept name and then simply INSERTS it into the dept table
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

// The quit function simply end the connection to the sql database
function quit() {

    connection.end(() => {
        console.table("CONNECTION CLOSED - HAVE A NICE DAY!");
    });

};
