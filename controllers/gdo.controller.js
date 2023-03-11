//import model
const { Projects } = require("../models/projects.model");
const { ResourceRequests } = require("../models/resoure_request.model");
// import modules
const expressAsyncHandler = require("express-async-handler");
//assocaitions
Projects.ResourceRequests = Projects.hasMany(ResourceRequests, {
  foreignKey: { name: "project_id", allowNull: false },
});
ResourceRequests.Projects = ResourceRequests.belongsTo(Projects, {
  foreignKey: { name: "project_id", allowNull: false },
});
ResourceRequests.sync();

//controllers
//add new projects
exports.addProject = expressAsyncHandler(async (req, res) => {
  await Projects.create(req.body);
  res.send({ message: "Project Added Successfully" });
});

//update project
exports.updateProject = expressAsyncHandler(async (req, res) => {
  let updates = await Projects.update(req.body, {
    where: { project_id: req.body.project_id },
  });

  if (updates[0]) {
    res.send({ message: "Project Details modified successfully" });
  } else {
    res.send({ alertMsg: "No modifications Done" });
  }
});

//get the projects
exports.getProjects = expressAsyncHandler(async (req, res) => {
  //we have user details in req by the action in verifyGdoHead
  let projects = await Projects.findAll({
    where: { gdo_head_id: req.user.emp_id },
  });
  res.send({ message: "All Projects", payload: projects });
});

//get project by project Id
exports.getProject = expressAsyncHandler(async (req, res) => {
  let project = await Projects.findByPk(req.params.project_id);
  if (project) {
    //check it is under loggedin gdo or other
    if (project.gdo_head_id === req.user.emp_id) {
      res.send({ message: "Project", payload: project });
    } else {
      res.send({
        alertMsg: "You are not authorized person to get this project details",
      });
    }
  } else {
    res.status(404).send({
      alertMsg: `Invalid Project Id... There is no project with project Id : ${req.params.project_id}`,
    });
  }
});

//raise resource request
exports.raiseResourceRequest = expressAsyncHandler(async (req, res) => {
  let request = await ResourceRequests.create(req.body);
  res.send({ message: "Resource request is raised successfully" });
});