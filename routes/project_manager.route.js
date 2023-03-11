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
  getAllConcerns,
  getDetailedView,
  getUpdates,
  getConcerns,
} = require("../controllers/project_manager.controller");

//routes

//get all projects details
router.get("/project-portfolio", verifyProjectManager, getProjects);

//get all concerns
router.get("/project-concerns", verifyProjectManager, getAllConcerns);

//post project update
router.post(
  "/project-update/project_id/:project_id",
  verifyProjectManager,
  projectUpdate
);

//rasie project concern
router.post(
  "/project-concern/project_id/:project_id",
  verifyProjectManager,
  raiseConcern
);

//get detailed of project
router.get(
  "/project-portfolio/detailed-view/project_id/:project_id",
  verifyProjectManager,
  getDetailedView
);

//get project detail details by project Id
router.get(
  "/project-portfolio/detailed-view/project-details/project_id/:project_id",
  verifyProjectManager,
  getProject
);

//get the team composition
router.get(
  "/project-portfolio/detailed-view/team-composition/project_id/:project_id",
  verifyProjectManager,
  getTeam
);

//get the project updates
router.get(
  "/project-portfolio/detailed-view/project-updates/project_id/:project_id",
  verifyProjectManager,
  getUpdates
);

//get the project concerns
router.get(
  "/project-portfolio/detailed-view/project-concerns/project_id/:project_id",
  verifyProjectManager,
  getConcerns
);

//export router
module.exports = router;
