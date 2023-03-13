const e = require("express");
const expressAsyncHandler = require("express-async-handler");
//import model
const { User } = require("../models/user.model");

//controllers

// set / update role of employee
exports.setRoleByempId = expressAsyncHandler(async (req, res) => {
  let { emp_id, user_type } = req.body;
  //check whether the employee is exist or not
  let users = await User.findAll({ where: { emp_id: emp_id } });

  //if user not exist send the same
  if (!users.length) {
    res
      .status(404)
      .send({ alertMsg: `No User found with employee id: ${emp_id}` });
  }
  //else set the role
  else {
    await User.update({ user_type: user_type }, { where: { emp_id: emp_id } });
    res.send({ message: "User role Updated Successfully" });
  }
});

// delete user
exports.deleteUser = expressAsyncHandler(async (req, res) => {
  // get the emp_id from the path
  let emp_id = req.params.emp_id;

  // check whether the employee exist or not
  let users = await User.findAll({ where: { emp_id: emp_id } });
  // if user exist the update the status
  if (users.length) {
    await User.update({ status: false }, { where: { emp_id: emp_id } });
    res.send({ message: "User Deleted Successfully" });
  }
  // else send the same
  else {
    res
      .status(404)
      .send({ alertMsg: `No user found with employee Id: ${emp_id}` });
  }
});

//update emp_details
exports.updateUser = expressAsyncHandler(async (req, res) => {
  // check user is exist or not if exist then update
  let user = await User.findAll({ where: { emp_id: req.body.emp_id } });

  if (user) {
    await User.update(req.body, { where: { emp_id: req.body.emp_id } });
    res.send({ message: "user Details Updated Sucessfully" });
  } else {
    res
      .status(404)
      .send({ alertMsg: `No user found with employee Id: ${req.body.emp_id}` });
  }
});

exports.getUsers = expressAsyncHandler(async (req, res) => {
  let users = await User.findAll({
    attributes: { exclude: ["reset_token", "reset_token_expires"] },
  });
  res.send({ message: "All users", payload: users });
});
