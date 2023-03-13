//create mini express application
const express = require("express");
const router = express.Router();

//body-parser
router.use(express.json());

//import controllers
let {
  register,
  login,
  forgotPasswordLink,
  resetPassword,
} = require("../controllers/public_controllers");

//routes

//register
router.post("/register", register);

//login
router.post("/login", login);

//send forgot password link
router.post("/forgot-password", forgotPasswordLink);

//rest password
router.post("/reset-password", resetPassword);
//export Router
module.exports = router;
router.get("/forgot-password/:token", (req, res) => {
  res.send(
    "This page will available after done with front end part.... it will ask for password and resnd the password and the token from path to reset password"
  );
});
