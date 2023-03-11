// import sequelize object
const sequelize = require("../db/db.config");
//import DataTypes class from sequelize module
const { DataTypes } = require("sequelize");

//define model
exports.ProjectUpdates = sequelize.define(
  "project_updates",
  {
    date: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    update_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schedule_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resourcing_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quality_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    waiting_for_client_inputs: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: false }
);
