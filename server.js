//create express application
const express = require("express");
//configure dotenv
require("dotenv").config();
const sequelize = require("./db/db.config");
const publicRouter = require("./routes/public_routes");

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

//invalid path middleware
app.use("*", (req, res, next) => {
  res.status(400).send({ alertMsg: "Invalid Path" });
});

//error handler middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ errorMsg: err.message });
});
