//create mini express app
const express = require("express");
const router = express.Router();
//import middlewares
const verifyProjectManager = require("../middlewares/verifyProjectManager");

//body parser
router.use(express.json());

//import constrollers or req handlers
let {
  projectUpdate,
  getProjects,
  getProject,
  getTeam,
  raiseConcern,
} = require("../controllers/project_manager.controller");

//routes

//post project update
router.post(
  "/project-update/project/:project_id",
  verifyProjectManager,
  projectUpdate
);

//get all projects details
router.get("/projects", verifyProjectManager, getProjects);

//get project detail details by project Id
router.get("/project/:project_id", verifyProjectManager, getProject);

//get the team composition
router.get(
  "/project/:project_id/team-composition",
  verifyProjectManager,
  getTeam
);

//rasie project concern
router.post("/project/:project_id/concern", verifyProjectManager, raiseConcern);

//export router
module.exports = router;
