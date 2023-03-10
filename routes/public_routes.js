//create mini express application
const express = require("express");
const router = express.Router();

//body-parser
router.use(express.json());

//import controllers
let { register, login } = require("../controllers/public_controllers");

//routes

//register
router.post("/register", register);

//login
router.post("/login", login);

//export Router
module.exports = router;
