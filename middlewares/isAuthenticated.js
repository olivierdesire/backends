const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const userFound = await User.findOne({ token: token }).select("account");
      if (userFound) {
        req.user = userFound;
        next();
      } else {
        return res.status(401).json("Unauthorized");
      }
    } else {
      return res.status(400).json("Token is required");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
