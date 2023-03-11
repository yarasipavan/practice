// import modules
const expressAsynchandler = require("express-async-handler");

//import models
const { Projects } = require("../models/projects.model");
const { ProjectUpdates } = require("../models/project_updates.model");
const { TeamMembers } = require("../models/team_members.model");
const { ProjectConcerns } = require("../models/project_concerns.model");

//associations

// projects--->project-updates
Projects.ProjectUpdates = Projects.hasMany(ProjectUpdates, {
  foreignKey: { name: "project_id", allowNull: false },
});
ProjectUpdates.Projects = ProjectUpdates.belongsTo(Projects, {
  foreignKey: { name: "project_id", allowNull: false },
});
ProjectUpdates.sync();

//projects -----> project concerns
Projects.ProjectConcerns = Projects.hasMany(ProjectConcerns, {
  foreignKey: { name: "project_id", allowNull: false },
});
ProjectConcerns.Projects = ProjectConcerns.belongsTo(Projects, {
  foreignKey: { name: "project_id", allowNull: false },
});

ProjectConcerns.sync();

//controllers
//post the project update
exports.projectUpdate = expressAsynchandler(async (req, res) => {
  await ProjectUpdates.create(req.body);
  res.send({ message: "Project Update Submitted Successfully" });
});

//raise project concerns
exports.raiseConcern = expressAsynchandler(async (req, res) => {
  //check the project is under logged in manager or not
  let projects = await Projects.findAll({
    where: {
      project_manager_id: req.user.emp_id,
      project_id: req.body.project_id,
    },
  });
  // if no project is found then send the same
  if (!projects.length) {
    res.status(404).send({
      alertMsg: `No project found under you with project Id ${req.body.project_id} to raise concern`,
    });
  }
  //else raise the concern
  else {
    await ProjectConcerns.create(req.body);
    res.status(201).send({ message: "Concern Raised Successfully" });
  }
});

//get the projets under him
exports.getProjects = expressAsynchandler(async (req, res) => {
  let projects = await Projects.findAll({
    where: { project_manager_id: req.user.emp_id },
    attributes: {
      exclude: ["domain", "type_of_project", "project_manager_id"],
    },
  });
  res.send({ message: "All projects", payload: projects });
});

//get project details under him by project id
exports.getProject = expressAsynchandler(async (req, res) => {
  let project = await Projects.findAll({
    where: {
      project_manager_id: req.user.emp_id,
      project_id: req.params.project_id,
    },
    attributes: { exclude: ["project_manager_id"] },
  });
  // if project details  found  send the details
  if (project.length) {
    res.send({ message: "Project Details", payload: project });
  }
  // if project details not found send the same to client
  else {
    res.send({
      alertMsg: `No project found under you with project id: ${req.params.project_id}`,
    });
  }
});

//get the team composition
exports.getTeam = expressAsynchandler(async (req, res) => {
  //first check the project id is under the logged in maanger or not
  let project = await Projects.findAll({
    where: {
      project_manager_id: req.user.emp_id,
      project_id: req.params.project_id,
    },
  });
  // if no project found
  if (!project.length) {
    res.send({
      message: `No project found under you with project id :${req.params.project_id} to get the team`,
    });
  } else {
    //get the team
    let team = await TeamMembers.findAll({
      where: { project_id: req.params.project_id },
    });
    res.send({ message: "Team Members", payload: team });
  }
});
