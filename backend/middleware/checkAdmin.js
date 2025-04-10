import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Roles } from "../utils/constants.js";

const checkAdmin = async (req, res, next) => {
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
      attributes: ["role"],
    });

    if (user?.role !== Roles.ADMIN)
      return res
        .status(403)
        .json({ error: "Forbidden - Admin access required" });

    req.user = user;
    next();
  } catch (err) {
    console.log("Check admin error: " + err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
};

export default checkAdmin;
