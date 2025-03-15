import express from "express";
import {
  addNewBranchController,
  deleteBranchByIdController,
  updateBranchController,
} from "../controllers/branch.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.post("/newBranch", checkAdmin, addNewBranchController);
router.delete("/deleteBranch", checkAdmin, deleteBranchByIdController);
router.patch("/updateBranch", checkAdmin, updateBranchController);

export default router;
