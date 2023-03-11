//import sesqelize object
const sequelize = require("../db/db.config");
//import DataTypes Class from sequelize module
const { DataTypes } = require("sequelize");

//define model
exports.ProjectConcerns = sequelize.define(
  "project_concerns",
  {
    concern_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    raised_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    concern_raised_on: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_concern_raised_internally: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Raised",
    },
    mitigated_on: {
      type: DataTypes.DATE,
    },
  },
  { freezeTableName: true, timestamps: false }
);
