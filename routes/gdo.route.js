//create moni express app
const express = require("express");
const router = express.Router();
//import middlewares
const verifyGdoHead = require("../middlewares/verifyGdoHead");

//import constrollers /req-handlers
let {
  getProjects,
  getProject,
  raiseResourceRequest,
  addTeam,
  getTeam,
  getAllConcerns,
  detailedView,
  getProjectUpdates,
  getConcerns,
  updateTeamMemberDetails,
  deleteTeamMember,
} = require("../controllers/gdo.controller");
//body-parser
router.use(express.json());

//routes

//add new project
// router.post("/new-project", verifyGdoHead, addProject);

// //update project details
// router.put("/project/:project_id", verifyGdoHead, updateProject);

//get all projects
router.get("/project-portfolio", verifyGdoHead, getProjects);

//get all concerns
router.get("/project-concerns", verifyGdoHead, getAllConcerns);

//raise resource request
router.post(
  "/resource-request/project_id/:project_id",
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
  "/project-portfolio/detailed-view/team-composition/project_id/:project_id",
  verifyGdoHead,
  getTeam
);

//get project updates
router.get(
  "/project-portfolio/detailed-view/project-updates/project_id/:project_id",
  verifyGdoHead,
  getProjectUpdates
);

//getting project concerns
router.get(
  "/project-portfolio/detailed-view/project-concerns/project_id/:project_id",
  verifyGdoHead,
  getConcerns
);

//add team to project
router.post(
  "/project-portfolio/detailed-view/team-composition/project_id/:project_id",
  verifyGdoHead,
  addTeam
);

router.put(
  "/project-portfolio/detailed-view/team-composition/project_id/:project_id/emp_id/:resource_id",
  verifyGdoHead,
  updateTeamMemberDetails
);
router.delete(
  "/project-portfolio/detailed-view/team-composition/project_id/:project_id/emp_id/:resource_id",
  verifyGdoHead,
  deleteTeamMember
);

//export router
module.exports = router;
