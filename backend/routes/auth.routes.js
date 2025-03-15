import express from "express";
import {
  createUserController,
  loginUserController,
  logoutUserController,
} from "../controllers/auth.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";
const router = express.Router();

router.post("/login", loginUserController);
router.post("/createUser", checkAdmin, createUserController);
router.post("/logout", logoutUserController);

export default router;
