//create mini express app
const express = require("express");
const router = express.Router();

//bodyparser
router.use(express.json());

//import middleware
const verifyAdminUser = require("../middlewares/verifyAdminUser");

//import controllers
let {
  getAllProjects,
  getAllConcerns,
  addProject,
  getResourceRequests,
  getProject,
  getDetailedView,
  getTeam,
  getUpdates,
  getConcerns,
} = require("../controllers/admin_user.controller");

//routes

//get al projects
router.get("/project-portfolio", verifyAdminUser, getAllProjects);

//get all concerns
router.get("/project-concerns", verifyAdminUser, getAllConcerns);

//add new project
router.post("/new-project", verifyAdminUser, addProject);

//get resource requests
router.get("/resource-requests", verifyAdminUser, getResourceRequests);

//get the detailed view by project id
router.get(
  "/project-portfolio/detailed-view/project_id/:project_id",
  verifyAdminUser,
  getDetailedView
);

//get project by project id
router.get(
  "/project-portfolio/project-details/project_id/:project_id",
  verifyAdminUser,
  getProject
);

//get team composition by project id
router.get(
  "/project-portfolio/team-composition/project_id/:project_id",
  verifyAdminUser,
  getTeam
);

//get project updates by project id
router.get(
  "/project-portfolio/project-updates/project_id/:project_id",
  verifyAdminUser,
  getUpdates
);

//get concerns by project id
router.get(
  "/project-portfolio/project-concerns/project_id/:project_id",
  verifyAdminUser,
  getConcerns
);

//import router
module.exports = router;
