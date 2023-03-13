//create express application
const express = require("express");
//configure dotenv
require("dotenv").config();
// import sequelize object and routers
const sequelize = require("./db/db.config");
const publicRouter = require("./routes/public_routes");
const superAdminRouter = require("./routes/super-admin.route");
const gdoRouter = require("./routes/gdo.route");
const projectManagerRouter = require("./routes/project_manager.route");
const adminUserRouter = require("./routes/admin_user.route");

//import models
const { Projects } = require("./models/projects.model");
const { ResourceRequests } = require("./models/resoure_request.model");
const { TeamMembers } = require("./models/team_members.model");
const { Employee } = require("./models/employee.model");
const { ProjectConcerns } = require("./models/project_concerns.model");
const { ProjectUpdates } = require("./models/project_updates.model");

const app = express();

//make the express application to listen the requests
let port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server started on port : ", port));

//check db connection
sequelize
  .authenticate()
  .then(() => console.log("Db connected"))
  .catch((err) =>
    console.log("Db not connected. There is an Problem.....", err)
  );

//assocaitions

//  projects -----> resource requests
Projects.ResourceRequests = Projects.hasMany(ResourceRequests, {
  foreignKey: { name: "project_id", allowNull: false },
});
ResourceRequests.Projects = ResourceRequests.belongsTo(Projects, {
  foreignKey: { name: "project_id", allowNull: false },
});
// ResourceRequests.sync();

//employee -- team member
Employee.TeamMembers = Employee.hasOne(TeamMembers, {
  foreignKey: { name: "resource_id", allowNull: false },
});
TeamMembers.Employee = TeamMembers.belongsTo(Employee, {
  foreignKey: { name: "resource_id", allowNull: false },
});

//projetcs ---- >Team members
Projects.TeamMembers = Projects.hasMany(TeamMembers, {
  foreignKey: { name: "project_id" },
});
TeamMembers.Projects = TeamMembers.belongsTo(Projects, {
  foreignKey: { name: "project_id" },
});
// TeamMembers.sync();

// projects--->project-updates
Projects.ProjectUpdates = Projects.hasMany(ProjectUpdates, {
  foreignKey: { name: "project_id", allowNull: false },
});
ProjectUpdates.Projects = ProjectUpdates.belongsTo(Projects, {
  foreignKey: { name: "project_id", allowNull: false },
});
// ProjectUpdates.sync();

//projects -----> project concerns
Projects.ProjectConcerns = Projects.hasMany(ProjectConcerns, {
  foreignKey: { name: "project_id", allowNull: false },
});
ProjectConcerns.Projects = ProjectConcerns.belongsTo(Projects, {
  foreignKey: { name: "project_id", allowNull: false },
});

// ProjectConcerns.sync();

sequelize.sync();

// path middlewares / apis
app.use("/", publicRouter);
app.use("/super-admin", superAdminRouter);
app.use("/gdo", gdoRouter);
app.use("/project-manager", projectManagerRouter);
app.use("/admin-user", adminUserRouter);

//invalid path middleware
app.use("*", (req, res, next) => {
  res.status(400).send({ alertMsg: "Invalid Path" });
});

//error handler middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ errorMsg: err.message });
});
