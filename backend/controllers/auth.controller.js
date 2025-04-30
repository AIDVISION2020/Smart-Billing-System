import User from "../models/user.model.js";
import { Roles } from "../utils/constants.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import Branch from "../models/branch.model.js";
import { Op } from "sequelize";

export const createUserController = async (req, res) => {
  try {
    const { userInfo } = req.body;
    if (!userInfo)
      return res.status(400).json({ error: "Insufficient user data" });

    const { username, name, email, password, confirmPassword, branchId, role } =
      userInfo;

    if (
      !username ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      (role !== Roles.ADMIN && !branchId)
    )
      return res.status(400).json({ error: "Insufficient user data" });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    if (role !== Roles.ADMIN) {
      if (!(await Branch.findOne({ where: { branchId } }))) {
        return res.status(400).json({
          error: "This branch does not exist",
        });
      }
    }

    await User.create({
      username,
      name,
      email,
      password,
      branchId: role === Roles.ADMIN ? "0" : branchId,
      role,
    });

    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.log("Create user controller error: " + err.message);
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
      role: foundUser.role,
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

export const fetchUsersByBranchIdController = async (req, res) => {
  try {
    // If branchIds array is empty then fetch all the users
    // BranchId 0 is for admin

    const { branchIds } = req.body;

    if (!branchIds)
      return res.status(400).json({ error: "Insufficient branch data" });
    const whereCondition =
      branchIds.length > 0
        ? {
            branchId: { [Op.in]: branchIds },
          }
        : {};
    const users = await User.findAll({
      where: whereCondition,
    });

    if (!users || users.length === 0)
      return res.status(200).json({
        message: `No users found ${
          branchIds.length > 0 && `for the branches - ${branchIds.join(", ")}`
        }`,
      });

    return res.status(200).json({ users });
  } catch (err) {
    console.log("Fetch users by branch id controller error: ", err);
    return res.status(500).json({ error: err.message });
  }
};

export const deleteUserByIdController = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID not provided" });
    const user = await User.findOne({
      where: {
        userId,
      },
    });
    if (!user)
      return res.status(404).json({ error: "No user found with this ID" });
    if (user.role === Roles.ADMIN)
      return res.status(403).json({ error: "Cannot delete admin" });
    const deletedUser = await User.destroy({
      where: {
        userId,
      },
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("Delete user by ID controller error: ", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateUserByIdController = async (req, res) => {
  try {
    const { updatedUser } = req.body;

    if (!updatedUser?.userId)
      return res.status(400).json({ error: "Insufficient data" });

    const updateData = Object.fromEntries(
      Object.entries(updatedUser).filter(([, value]) => value !== undefined)
    );
    if (updateData.role === Roles.ADMIN) updateData.branchId = "0";
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No valid fields to update" });
    }
    const [updatedRows] = await User.update(updateData, {
      where: { userId: updatedUser.userId },
    });

    if (!updatedRows) {
      return res.status(404).json({ error: "No matching record found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.log("Update user by ID controller error: ", err);
    return res.status(500).json({ error: err.message });
  }
};

const isSomeoneLoggedIn = (req) => {
  const token = req.cookies.jwt;
  if (!token) return false;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) return false;
  return decoded;
};
