//middleware handle user's token verification
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json("No token. User is not authorized");
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({msg: "Token is not valid"});
  }
};
