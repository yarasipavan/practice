//import sequelize object
const sequelize = require("../db/db.config");
//import dataTypes class from sequelize module
const { DataTypes } = require("sequelize");

//import models
const { Employee } = require("../models/employee.model");
const { Projects } = require("../models/projects.model");

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
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
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
    resource_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Employee,
        key: "emp_id",
      },
    },
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Projects,
        key: "project_id",
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);
