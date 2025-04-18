import express from "express";
import {
  getGoodByCategoryNames,
  addNewGoods,
  modifyGoodByItemId,
  deleteGoodsByItemIds,
  deleteCategoriesByCategoryIds,
  addNewCategory,
  getCategoriesByQuery,
  getGoodsByQuery,
  modifyCategoryById,
} from "../controllers/goods.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/getGoods", protectRoute, getGoodByCategoryNames);
router.post("/addCategory", protectRoute, addNewCategory);
router.post("/addGoods", protectRoute, addNewGoods);
router.post("/modifyGood", protectRoute, modifyGoodByItemId);
router.patch("/modifyCategory", protectRoute, modifyCategoryById);
router.post("/getCategoriesByQuery", protectRoute, getCategoriesByQuery);
router.post("/getGoodsByQuery", protectRoute, getGoodsByQuery);
router.delete("/deleteGoods", protectRoute, deleteGoodsByItemIds);
router.delete("/deleteCategories", protectRoute, deleteCategoriesByCategoryIds);

export default router;
