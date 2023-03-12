//import jsonwebtoken
const jwt = require("jsonwebtoken");
//configure dotenv
require("dotenv").config();

//funtion to veify the token and pass the flow
let verifyToken = (req, res, next) => {
  //lets get the bearerToken from request headers
  let bearerToken = req.headers.authorization;
  // if bearer token in not existed, the user is not authorized
  if (bearerToken === undefined) {
    res.status(401).send({ alertMsg: "You are not authenticated" });
  }
  //else verify the token
  else {
    //get the token from bearerToken
    let token = bearerToken.split(" ")[1];
    //verify Token
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        res
          .status(403)
          .send({ alertMsg: "Session Expired please login again..." });
      } else {
        console.log(decoded.status);
        if (decoded.user_type == "GDO-HEAD" && decoded.status) {
          req.user = { emp_id: decoded.emp_id, email: decoded.email };
          next();
        } else {
          res.status(403).send({ alertMsg: "You are not authorized user.." });
        }
      }
    });
  }
};

module.exports = verifyToken;
