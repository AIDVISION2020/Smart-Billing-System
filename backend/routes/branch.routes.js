import express from "express";
import {
  addNewBranchController,
  deleteBranchByIdController,
  updateBranchController,
  getAccessibleBranchesController,
  getAllCategoriesFromBranchId,
} from "../controllers/branch.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/newBranch", checkAdmin, addNewBranchController);
router.delete("/deleteBranch", checkAdmin, deleteBranchByIdController);
router.patch("/updateBranch", checkAdmin, updateBranchController);
router.post(
  "/getAccessibleBranches",
  protectRoute,
  getAccessibleBranchesController
);
router.post("/getCategories", protectRoute, getAllCategoriesFromBranchId);
export default router;
