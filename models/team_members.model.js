//import sequelize object
const sequelize = require("../db/db.config");
//import dataTypes class from sequelize module
const { DataTypes } = require("sequelize");

//define model
exports.TeamMembers = sequelize.define(
  "team_members",
  {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    end_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billing_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exposed_to_customer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    allocation_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: false }
);
