import express from "express";
import {
  getGoodByCategoryNames,
  addNewGood,
  modifyGoodByItemId,
  deleteGoodByItemId,
  deleteCategoriesByCategoryIds,
} from "../controllers/goods.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/getGoods", protectRoute, getGoodByCategoryNames);
router.post("/addGood", protectRoute, addNewGood);
router.post("/modifyGood", protectRoute, modifyGoodByItemId);
router.delete("/deleteGood", protectRoute, deleteGoodByItemId);
router.delete("/deleteCategory", protectRoute, deleteCategoriesByCategoryIds);

export default router;
