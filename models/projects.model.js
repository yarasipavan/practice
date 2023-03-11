//import sequelize obj
const sequelize = require("../db/db.config");
// import dataTypes Class from sequelize module
const { DataTypes } = require("sequelize");
const { User } = require("./user.model");

//define model and export
exports.Projects = sequelize.define(
  "projects",
  {
    project_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    client_account: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "emp_id",
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "In-Progress",
    },
    start_date: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    end_date: {
      type: DataTypes.DATE,
    },
    fitness: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_of_project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gdo_head_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        allowNull: false,
        key: "emp_id",
      },
    },
    project_manager_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        allowNull: false,
        key: "emp_id",
      },
    },
  },
  { timestamps: false, freezeTableName: true }
);

(async () => await this.Projects.sync())();
