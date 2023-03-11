// import modules
const expressAsyncHandler = require("express-async-handler");

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

//functions
let checkProjectIsUnder = async (project_id, project_manager_id) => {
  let projects = await Projects.findAll({
    where: {
      project_id: project_id,
      project_manager_id: project_manager_id,
    },
  });
  if (projects.length) return true;
  else return false;
};

//controllers

//post the project update
exports.projectUpdate = expressAsyncHandler(async (req, res) => {
  if (await checkProjectIsUnder(req.body.project_id, req.user.emp_id)) {
    await ProjectUpdates.create(req.body);
    res.status(201).send({ message: "Project Update Submitted Successfully" });
  } else {
    res.status(404).send({
      alertMsg: `No project found under you with project Id as ${req.body.project_id} to post project update `,
    });
  }
});

//raise project concerns
exports.raiseConcern = expressAsyncHandler(async (req, res) => {
  //check the project is under logged in manager or not
  // if no project is found then send the same
  if (!(await checkProjectIsUnder(req.body.project_id, req.user.emp_id))) {
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
exports.getProjects = expressAsyncHandler(async (req, res) => {
  let projects = await Projects.findAll({
    where: { project_manager_id: req.user.emp_id },
    attributes: {
      exclude: ["domain", "type_of_project", "project_manager_id"],
    },
  });
  if (projects.length) {
    res.send({ message: "All projects", payload: projects });
  } else {
    res.status(404).send({ alertMsg: "No projects found under you" });
  }
});

//get all concerns
exports.getAllConcerns = expressAsyncHandler(async (req, res) => {
  //get the emp_id of logged in user
  let emp_id = req.user.emp_id;
  //get the concerns where the project id underuser
  let concerns = await ProjectConcerns.findAll({
    include: {
      model: Projects,
      where: {
        project_manager_id: emp_id,
      },
      attributes: ["project_name", "project_id", "gdo_head_id"],
    },
    attributes: {
      exclude: ["id", "project_id"],
    },
  });
  res.send({ message: "All concerns", payload: concerns });
});

//get  project detailed view
exports.getDetailedView = expressAsyncHandler(async (req, res) => {
  //first check the requested project is exist under logged in GDO Head
  //if exist send the project view

  if (await checkProjectIsUnder(req.params.project_id, req.user.emp_id)) {
    let details = await Projects.findAll({
      where: {
        project_id: req.params.project_id,
      },
      attributes: ["fitness", "project_id"],
      include: [
        {
          model: ProjectConcerns,
          attributes: ["status"],
        },
        {
          model: TeamMembers,
          attributes: ["billing_status"],
        },
      ],
    });

    // count project concers whos status is raised
    let concerns_count = 0;
    details[0].project_concerns.forEach((concern) => {
      if (concern.status.toLowerCase() == "raised") {
        concerns_count++;
      }
    });

    // similarly count team members whose billing status is billed
    let billed_members_count = 0;
    details[0].team_members.forEach((member) => {
      if (member.billing_status.toLowerCase() == "billed") {
        billed_members_count++;
      }
    });
    let detailed_view = {
      project_id: details[0].project_id,
      fitness: details[0].fitness,
      team_count: billed_members_count,
      concerns_count: concerns_count,
    };
    res.send({ payload: detailed_view });
  }
  // if not exist send not found
  else {
    res.status(404).send({
      alertMsg: `No project found under you with project id: ${req.params.project_id} to get the detailed view `,
    });
  }
});

//get project details under him by project id
exports.getProject = expressAsyncHandler(async (req, res) => {
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
exports.getTeam = expressAsyncHandler(async (req, res) => {
  //first check the project id is under the logged in maanger or not
  // if no project found
  if (!(await checkProjectIsUnder(req.params.project_id, req.user.emp_id))) {
    res.send({
      message: `No project found under you with project id :${req.params.project_id} to get the team`,
    });
  } else {
    //get the team
    let team = await TeamMembers.findAll({
      where: { project_id: req.params.project_id },
      include: {
        association: TeamMembers.Employee,
        attributes: { exclude: ["emp_id"] },
      },
      attributes: { exclude: ["project_id"] },
    });
    res.send({ message: "Team Members", payload: team });
  }
});

//get the project updates by project id
exports.getUpdates = expressAsyncHandler(async (req, res) => {
  //check is the project is under GDO head or not
  let projects = await Projects.findAll({
    where: {
      project_id: req.params.project_id,
      gdo_head_id: req.user.emp_id,
    },
  });
  // if exist then send the project updates
  if (await checkProjectIsUnder(req.params.project_id, req.user.emp_id)) {
    let updates = await ProjectUpdates.findAll({
      where: { project_id: req.params.project_id },
      order: [["date", "DESC"]],
    });
    if (updates.length) {
      res.send({ message: "All updates", payload: updates });
    } else {
      res.send({ alertMsg: "No project updates found" });
    }
  }
  //esle send not found
  else {
    res.status(404).send({
      alertMsg: `No project is found under you with product id as ${req.params.project_id} to get the project updates`,
    });
  }
});

//get the project concerns by project id
exports.getConcerns = expressAsyncHandler(async (req, res) => {
  //check the project is exist under loggedin user
  // if exist then send the project concerns
  if (await checkProjectIsUnder(req.params.project_id, req.user.emp_id)) {
    let concerns = await ProjectConcerns.findAll({
      where: {
        project_id: req.params.project_id,
      },
      order: [["concern_raised_on", "desc"]],
    });
    // if there are concerns , send all concerns
    if (concerns.length) {
      res.send({ message: "All concerns", payload: concerns });
    }
    // if no cercerns send same
    else {
      res.send({ alertMsg: "No Concerns raised in this project till now" });
    }
  } else {
    res.status(404).send({
      alertMsg: `No project is found under you with product id as ${req.params.project_id} to get the project concerns`,
    });
  }
});
