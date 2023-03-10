//import Sequelize class from sequelize module
const { Sequelize } = require("sequelize");

//confire dotenv
require("dotenv").config();

//create instance for Sequelize class i.e create connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
    port: process.env.DB_PORT || 3306,
  }
);

//export sequelize obj
module.exports = sequelize;
