import express from "express";
import {
  getGoodByCategoryNames,
  addNewGoods,
  modifyGoodByItemId,
  deleteGoodsByItemIds,
  deleteCategoriesByCategoryIds,
  addNewCategory,
} from "../controllers/goods.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/getGoods", protectRoute, getGoodByCategoryNames);
router.post("/addCategory", protectRoute, addNewCategory);
router.post("/addGoods", protectRoute, addNewGoods);
router.post("/modifyGood", protectRoute, modifyGoodByItemId);
router.delete("/deleteGoods", protectRoute, deleteGoodsByItemIds);
router.delete("/deleteCategories", protectRoute, deleteCategoriesByCategoryIds);

export default router;
