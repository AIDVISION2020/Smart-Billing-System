import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Roles } from "../utils/constants.js";

const checkBillingAuthority = async (req, res, next) => {
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
      attributes: ["role", "userId"],
    });

    if (user?.role !== Roles.BILLER)
      return res
        .status(403)
        .json({ error: "Forbidden - Biller access required" });

    req.user = user;
    next();
  } catch (err) {
    console.log("Check billing authority error: " + err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
};

export default checkBillingAuthority;
