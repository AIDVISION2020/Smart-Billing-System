import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    const user = await User.findOne({
      where: {
        userId: decoded.userId,
      },
      attributes: { exclude: ["password"] }, // Excludes the password field
    });

    req.user = user;
    next();
  } catch (err) {
    console.log("Protect route error: " + err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
  // Dummy code for rn
  next();
};

export default protectRoute;
