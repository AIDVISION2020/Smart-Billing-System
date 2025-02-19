import express from "express";
import {
  signupUserController,
  loginUserController,
  logoutUserController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginUserController);
router.post("/signup", signupUserController);
router.post("/logout", logoutUserController);

export default router;
