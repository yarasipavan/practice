// import modules
const expressAsyncHandler = require("express-async-handler");
//import model
const { Projects } = require("../models/projects.model");
const { ResourceRequests } = require("../models/resoure_request.model");
const { TeamMembers } = require("../models/team_members.model");
const { Employee } = require("../models/employee.model");
const { ProjectConcerns } = require("../models/project_concerns.model");
const { ProjectUpdates } = require("../models/project_updates.model");

//assocaitions

//  projects -----> resource requests
Projects.ResourceRequests = Projects.hasMany(ResourceRequests, {
  foreignKey: { name: "project_id", allowNull: false },
});
ResourceRequests.Projects = ResourceRequests.belongsTo(Projects, {
  foreignKey: { name: "project_id", allowNull: false },
});
ResourceRequests.sync();

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
TeamMembers.sync();

//controllers
//add new projects
exports.addProject = expressAsyncHandler(async (req, res) => {
  await Projects.create(req.body, { include: TeamMembers });
  res.send({ message: "Project Added Successfully" });
});

//update project
exports.updateProject = expressAsyncHandler(async (req, res) => {
  //check the modifying project is exist under logged in gdo head or not
  let project = await Projects.findAll({
    where: {
      project_id: req.body.project_id,
      gdo_head_id: req.user.emp_id,
    },
  });
  //if exist modify
  if (project) {
    let updates = await Projects.update(req.body, {
      where: { project_id: req.body.project_id },
    });

    if (updates[0]) {
      res.send({ message: "Project Details modified successfully" });
    } else {
      res.send({ alertMsg: "No modifications Done" });
    }
  }
  // else send not found
  else {
    res.status(404).send({
      alertMsg: `No project found under you with project id ${req.body.project_id} to update`,
    });
  }
});

//get the projects
exports.getProjects = expressAsyncHandler(async (req, res) => {
  //we have logged in user details in req by the action in verifyGdoHead,, so get the projects under logged in GDO Head
  let projects = await Projects.findAll({
    where: { gdo_head_id: req.user.emp_id },
    attributes: { exclude: ["domain", "type_of_project", "gdo_head_id"] },
  });
  //projects exist send projects
  if (projects.length) {
    res.send({ message: "All Projects", payload: projects });
  }
  //else send not found
  else {
    res.status(404).send({ alertMsg: "No projects found under you" });
  }
});

//get all concerns
exports.getAllConcerns = expressAsyncHandler(async (req, res) => {
  //get the emp_id of logged in user
  let emp_id = req.user.emp_id;
  //get the cencers where the project id underuser
  let concerns = await ProjectConcerns.findAll({
    include: {
      model: Projects,
      where: {
        gdo_head_id: emp_id,
      },
      attributes: ["project_name", "project_id", "project_manager_id"],
    },
    attributes: {
      exclude: ["id", "project_id"],
    },
  });
  res.send({ message: "All concerns", payload: concerns });
});

//raise resource request
exports.raiseResourceRequest = expressAsyncHandler(async (req, res) => {
  //first check the requested project is exist under logged in GDO Head
  let projects = await Projects.findAll({
    where: {
      project_id: req.body.project_id,
      gdo_head_id: req.user.emp_id,
    },
  });
  //if exist then raise the resource request
  if (projects.length) {
    await ResourceRequests.create(req.body);
    res
      .status(201)
      .send({ message: "Resource request is raised successfully" });
  }
  // else send the not found to client
  else {
    res.status(404).send({
      alertMsg: `No project found under you with project id: ${req.body.project_id} to raise the resource request `,
    });
  }
});

//project detailed view  by project id
exports.detailedView = expressAsyncHandler(async (req, res) => {
  //first check the requested project is exist under logged in GDO Head
  let projects = await Projects.findAll({
    where: {
      project_id: req.params.project_id,
      gdo_head_id: req.user.emp_id,
    },
  });
  if (projects.length) {
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
  } else {
    res.status(404).send({
      alertMsg: `No project found under you with project id: ${req.params.project_id} to get the detailed view `,
    });
  }
});

//get project by project Id
exports.getProject = expressAsyncHandler(async (req, res) => {
  //check the whether the requested project is under Loggedin GDO head
  let projects = await Projects.findAll({
    where: {
      project_id: req.params.project_id,
      gdo_head_id: req.user.emp_id,
    },
    attributes: { exclude: ["gdo_head_id"] },
  });

  //if exist send the project details
  if (projects.length) {
    res.send({ message: "Project Details", payload: projects[0] });
  }
  // else send the same to client
  else {
    res.status(400).send({
      alertMsg: `No project found under you with project id ${req.params.project_id}`,
    });
  }
});

//get the team composition
exports.getTeam = expressAsyncHandler(async (req, res) => {
  //check the requesting project team is under loggedin GDO head or not
  let projects = await Projects.findAll({
    where: {
      project_id: req.params.project_id,
      gdo_head_id: req.user.emp_id,
    },
  });
  // if exist then send the team details
  if (projects.length) {
    // find the team members
    let team = await TeamMembers.findAll({
      where: { project_id: req.params.project_id },
      include: {
        association: TeamMembers.Employee,
        attributes: { exclude: ["emp_id"] },
      },
      attributes: { exclude: ["project_id"] },
    });
    res.send({ message: "team composition", payload: team });
  }
  // else send not found message
  else {
    res.status(404).send({
      alertMsg: `No project is found under you with product id as ${req.params.project_id} to get the team composition`,
    });
  }
});

//get the projects updates
exports.getProjectUpdates = expressAsyncHandler(async (req, res) => {
  //check is the project is under GDO head or not
  let projects = await Projects.findAll({
    where: {
      project_id: req.params.project_id,
      gdo_head_id: req.user.emp_id,
    },
  });
  // if exist then send the project updates
  if (projects.length) {
    let updates = await ProjectUpdates.findAll({
      where: { project_id: req.params.project_id },
      order: [["date", "DESC"]],
    });
    if (updates.length) {
      res.send({ message: "All updates", payload: updates });
    } else {
      res.send({ alertMsg: "No update found" });
    }
  }
  //esle send not found
  else {
    res.status(404).send({
      alertMsg: `No project is found under you with product id as ${req.params.project_id} to get the project updates`,
    });
  }
});

//get project concerns
exports.getConcerns = expressAsyncHandler(async (req, res) => {
  let projects = await Projects.findAll({
    where: {
      project_id: req.params.project_id,
      gdo_head_id: req.user.emp_id,
    },
  });
  // if exist then send the project concerns
  if (projects.length) {
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

//add the team
exports.addTeam = expressAsyncHandler(async (req, res) => {
  //check whether logged in user is GDO Head for team assigning project.. i.e the assigning project is under logged in user

  let projects = await Projects.findAll({
    where: {
      project_id: req.params.project_id,
      gdo_head_id: req.user.emp_id,
    },
  });

  //if yes add team
  if (projects.length) {
    //add the team mebers

    let team = await TeamMembers.bulkCreate(req.body.team_members);
    res.send({ message: "Team added successfully" });
  }
  //else send not found project under you
  else {
    res.status(404).send({
      alertMsg: `No product found under you with orject id ${req.body.project_id} to add the team members`,
    });
  }
});
