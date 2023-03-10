//create mini express app
const express = require("express");
const router = express.Router();
//import middlewares
let verifySuperAdmin = require("../middlewares/verifySuperAdmin");

//body-parser
router.use(express.json());

//import controllers / req handlers
let {
  setRoleByempId,
  deleteUser,
  updateUser,
} = require("../controllers/super-admin-controller");

//routes

//role mapping
router.post("/role-mapping/employee/:emp_id", verifySuperAdmin, setRoleByempId);

// update user
router.put("/employee/:emp_id", verifySuperAdmin, updateUser);

//delete user
router.delete("/employee/:emp_id", verifySuperAdmin, deleteUser);

//export router
module.exports = router;
