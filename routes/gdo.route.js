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
} = require("../controllers/gdo.controller");
//body-parser
router.use(express.json());

//routes

//add new project
router.post("/new-project", verifyGdoHead, addProject);

//update project details
router.put("/project/:project_id", verifyGdoHead, updateProject);

//get all projects
router.get("/projects", verifyGdoHead, getProjects);

//get project by project Id
router.get("/project/:project_id", verifyGdoHead, getProject);

//raise resource request
router.post(
  "/resource-request/project/:project_id",
  verifyGdoHead,
  raiseResourceRequest
);

//export router
module.exports = router;
