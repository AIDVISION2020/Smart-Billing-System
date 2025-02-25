import express from "express";
import {
  addNewBranchController,
  deleteBranchByIdController,
  updateBranchController,
} from "../controllers/branch.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/newBranch", protectRoute, addNewBranchController);
router.delete("/deleteBranch", protectRoute, deleteBranchByIdController);
router.patch("/updateBranch", protectRoute, updateBranchController);

export default router;
