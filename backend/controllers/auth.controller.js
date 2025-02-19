import User from "../models/user.model.js";
import sequelize from "../db/connect.db.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const signupUserController = async (req, res) => {
  try {
    if (isSomeoneLoggedIn(req))
      return res.status(400).json({ error: "User already logged in" });
    const { userInfo } = req.body;
    if (!userInfo)
      return res.status(400).json({ error: "Insufficient user data" });
    const { username, name, email, password, confirmPassword, branchId } =
      userInfo;

    if (
      !username ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !branchId
    )
      return res.status(400).json({ error: "Insufficient user data " });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    if (!(await checkIfTableExists(`categories_${branchId}`))) {
      return res.status(400).json({
        error: "This branch does not exist",
      });
    }

    await User.create({
      username,
      name,
      email,
      password,
      branchId,
    });

    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.log("Signup controller error: " + err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const loginUserController = async (req, res) => {
  try {
    if (isSomeoneLoggedIn(req))
      return res.status(400).json({ error: "User already logged in" });
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Insufficient credentials" });
    const foundUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!foundUser || !(await bcryptjs.compare(password, foundUser.password))) {
      return res.status(400).json({ error: "Invalid login credentials" });
    }

    generateTokenAndSetCookie(foundUser.userId, res);
    res.status(201).json({
      _id: foundUser.userId,
      name: foundUser.name,
      email: foundUser.email,
      username: foundUser.username,
      branchId: foundUser.branchId,
      message: "Login successful",
    });
  } catch (err) {
    console.log("Error while loggin in: ", err);
    return res.status(500).json({ error: err.message });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    if (!isSomeoneLoggedIn(req))
      return res.status(403).json({ error: "User not logged in" });
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Logout controller error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkIfTableExists = async (tableName) => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllSchemas();

    const tableExists = tables.some((schema) => {
      return schema.Tables_in_goods_management === tableName;
    });
    // console.log(tables);
    console.log(`Table ${tableName} exists:`, tableExists);
    return tableExists;
  } catch (error) {
    console.error(`Error checking table existence for ${tableName}:`, error);
    return false;
  }
};

const isSomeoneLoggedIn = (req) => {
  const token = req.cookies.jwt;
  if (!token) return false;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) return false;
  return true;
};
