const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const randomToken = require("random-token");

const nodemailer = require("nodemailer");
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
User.sync({ alter: true });

//create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.from_mail,
    pass: process.env.app_password,
  },
});

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
  let user = await User.findByPk(email, {
    attributes: { exclude: ["reset_token"] },
  });
  //if user existed
  if (user) {
    //verify the password
    // if password is correct
    if (await bcryptjs.compare(password, user.password)) {
      //genarate token
      let token = jwt.sign(
        {
          email: email,
          user_type: user.user_type,
          status: user.status,
          emp_id: user.emp_id,
        },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "7d" }
      );
      user = user.toJSON();
      delete user.password;
      //send the response
      res.send({ message: "Login Successful", token: token, user: user });
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

//forgot password generate link
exports.forgotPasswordLink = expressAsyncHandler(async (req, res) => {
  //check the user existed with requested email
  let user = await User.findOne({ where: { email: req.body.email } });
  //if user exist the send the password reset link to email
  if (user) {
    //generate random token and set expire time for link

    //generate  token
    user.reset_token = jwt.sign(
      { email: req.body.email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: 600 } //10 min
    );

    await user.save();
    //send mail
    const resetLink = `${process.env.CLIENT_URL}/forgot-password/${user.reset_token}`;
    const mailOptions = {
      from: "process.env.from_mail",
      to: req.body.email,
      subject: "Password Reset Request",
      text: `Click the link below to reset your password:\n\n${resetLink}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending reset email");
      } else {
        console.log(`Email sent: ${info.response}`);
        res
          .status(200)
          .send({ message: "Reset email sent", token: user.reset_token });
      }
    });
  } else {
    res.status(404).send({
      alertMsg: "This Email is not registered to this portal",
    });
  }
});

//reset password
exports.resetPassword = expressAsyncHandler(async (req, res) => {
  //get the token and new password
  //if token valid update user password
  let { token, password } = req.body;
  console.log(password);
  jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
    if (err) {
      res.send({ alertMsg: "Invalid link or link expired" });
    } else {
      //hash the password
      let hashedpwd = await bcryptjs.hash(password, 5);
      await User.update(
        { password: hashedpwd },
        { where: { email: decoded.email } }
      );
      res.send({ message: "password Updated Successfully" });
    }
  });
});
