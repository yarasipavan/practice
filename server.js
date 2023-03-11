//create express application
const express = require("express");
//configure dotenv
require("dotenv").config();
const sequelize = require("./db/db.config");
const publicRouter = require("./routes/public_routes");
const superAdminRouter = require("./routes/super-admin.route");
const gdoRouter = require("./routes/gdo.route");
const projectManagerRoute = require("./routes/project_manager.route");

const app = express();

//make the express application to listen the requests
let port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server started on port : ", port));

//check db connection
sequelize
  .authenticate()
  .then(() => console.log("Db connected"))
  .catch((err) =>
    console.log("Db not connected. There is an Problem.....", err)
  );

// path middlewares / apis
app.use("/", publicRouter);
app.use("/super-admin", superAdminRouter);
app.use("/gdo", gdoRouter);
app.use("/project-manager", projectManagerRoute);

//invalid path middleware
app.use("*", (req, res, next) => {
  res.status(400).send({ alertMsg: "Invalid Path" });
});

//error handler middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ errorMsg: err.message });
});
