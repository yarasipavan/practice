//create express application
const express = require("express");
const app = express();
//configure dotenv
require("dotenv").config();
//make the express application to listen the requests
let port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server started on port : ", port));
//db connection -- import sequelize object
const sequelize = require("./db/db.config");
//check db connection
sequelize
  .authenticate()
  .then(() => console.log("Db connected"))
  .catch((err) =>
    console.log("Db not connected. There is an Problem.....", err)
  );

//invalid path middleware
app.use("*", (req, res, next) => {
  res.status(400).send({ alertMsg: "Invalid Path" });
});

//error handler middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ errorMsg: err.message });
});
