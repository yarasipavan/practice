//import sequelize object
const sequelize = require("../db/db.config");
// import DataTypes class from sequelize module
const { DataTypes } = require("sequelize");

//define model
exports.User = sequelize.define(
  "user",
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        is: {
          args: /^[a-z0-9](\.?[a-z0-9]){3,}@westagilelabs\.com$/,
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    user_type: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    reset_token: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false, freezeTableName: true }
);
