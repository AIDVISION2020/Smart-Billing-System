import express from "express";
import {
  createUserController,
  loginUserController,
  logoutUserController,
  fetchUsersByBranchIdController,
  deleteUserByIdController,
  updateUserByIdController,
} from "../controllers/auth.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.post("/login", loginUserController);
router.post("/createUser", checkAdmin, createUserController);
router.post("/logout", logoutUserController);
router.post("/getUsersByBranchId", checkAdmin, fetchUsersByBranchIdController);
router.delete("/deleteUserById", checkAdmin, deleteUserByIdController);
router.post("/updateUser", checkAdmin, updateUserByIdController);

export default router;
