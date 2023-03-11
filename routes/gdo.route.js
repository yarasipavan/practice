//create moni express app
const express = require("express");
const router = express.Router();
//import middlewares
const verifyGdoHead = require("../middlewares/verifyGdoHead");

//import constrollers /req-handlers
let {
  addProject,
  updateProject,
  getProjects,
  getProject,
  raiseResourceRequest,
  addTeam,
  getTeam,
  getAllConcerns,
  detailedView,
  getProjectUpdates,
  getConcerns,
} = require("../controllers/gdo.controller");
//body-parser
router.use(express.json());

//routes

//add new project
router.post("/new-project", verifyGdoHead, addProject);

//update project details
router.put("/project/:project_id", verifyGdoHead, updateProject);

//get all projects
router.get("/project-portfolio", verifyGdoHead, getProjects);

//get all concerns
router.get("/project-concerns", verifyGdoHead, getAllConcerns);

//raise resource request
router.post(
  "/resource-request/project/:project_id",
  verifyGdoHead,
  raiseResourceRequest
);

//detailedView
router.get(
  "/project-portfolio/detailed-view/project_id/:project_id",
  verifyGdoHead,
  detailedView
);

//get project by project Id
router.get(
  "/project-portfolio/detailed-view/project-details/project_id/:project_id",
  verifyGdoHead,
  getProject
);

//get team by project id
router.get(
  "/project-portfolio/detailed-view/project_id/:project_id/team-composition",
  verifyGdoHead,
  getTeam
);

//get project updates
router.get(
  "/project-portfolio/detailed-view/project_id/:project_id/project-updates",
  verifyGdoHead,
  getProjectUpdates
);

//getting project concerns
router.get(
  "/project-portfolio/detailed-view/project_id/:project_id/project-concerns",
  verifyGdoHead,
  getConcerns
);

//add team to project
router.post("/team-composition/project/:project_id", verifyGdoHead, addTeam);

//export router
module.exports = router;
