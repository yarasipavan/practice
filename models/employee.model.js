//import sequelize object
const sequelize = require("../db/db.config");
// import DataTypes class from sequelize module
const { DataTypes } = require("sequelize");

//define model
exports.Employee = sequelize.define(
  "employee",
  {
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    emp_email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: {
          args: /^[a-z0-9](\.?[a-z0-9]){5,}@westagilelabs\.com$/,
          msg: "Only westagilelabs demain mail accepts",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        nameLength(name) {
          if (name.length <= 2) {
            throw new Error("Name should have morethan 2 characters ");
          }
        },
      },
    },
  },
  { timestamps: false, freezeTableName: true }
);
(async () => await this.Employee.sync())();
