const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//configure dotenv
require("dotenv").config();

//import models
const { Employee } = require("../models/employee.model");
const { User } = require("../models/user.model");
// import sequelize obj
const sequelize = require("../db/db.config");

//associations
Employee.User = Employee.hasOne(User, {
  foreignKey: { name: "emp_id", allowNull: false },
});
User.Employee = User.belongsTo(Employee, {
  foreignKey: { name: "emp_id", allowNull: false },
});
User.sync();

//controllers or request handlers

//register request handler
exports.register = expressAsyncHandler(async (req, res) => {
  // check the registering user is Employee in WAL or not
  let employees = await Employee.findAll({
    where: { emp_id: req.body.emp_id, emp_email: req.body.email },
  });
  // if the registering user is employee
  if (employees.length) {
    //check the user is already registered
    let userExist = await User.findByPk(req.body.email);
    if (!userExist) {
      let newUser = req.body;
      //hash the password
      let hashedpwd = await bcryptjs.hash(req.body.password, 5);
      //set the hashedpwd to password
      newUser.password = hashedpwd;
      // insert into user table
      let user = await User.create(newUser);
      res.status(201).send({ message: "Your registration is successfull" });
    } else {
      res.send({
        alertMsg: "You already register.. please login with your credentials",
      });
    }
  } else {
    res.send({
      alertMsg:
        "You are not at West Agile Employees List.. You are not eligible to register ",
    });
  }
});

//login
exports.login = expressAsyncHandler(async (req, res) => {
  //let the email and password from request body
  let { email, password } = req.body;
  //check the user existed with email
  let user = await User.findByPk(email);
  //if user existed
  if (user) {
    //verify the password
    // if password is correct
    if (await bcryptjs.compare(password, user.password)) {
      //genarate token
      let token = jwt.sign(
        { email: email, user_type: user.user_type, status: user.status },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "7d" }
      );
      //send the response
      res.send({ message: "Login Successful", token: token });
    }
    //if password is incorrect
    else {
      res.send({ alertMsg: "Invalid password" });
    }
  }
  //if email not existed
  else {
    res.status(200).send({ alertMsg: "Invalid Email" });
  }
});
