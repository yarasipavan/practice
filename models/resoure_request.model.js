//import sequelize object
const sequelize = require("../db/db.config");
// import DataTypes Class from sequelize module
const { DataTypes } = require("sequelize");

//define model
exports.ResourceRequests = sequelize.define(
  "resource_requests",
  {
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    request_on: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    request_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: false }
);
