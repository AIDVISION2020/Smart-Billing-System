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
import checkInventoryAuthority from "../middleware/checkInventoryAuthority.js";
const router = express.Router();

router.post("/getGoods", checkInventoryAuthority, getGoodByCategoryNames);
router.post("/addCategory", checkInventoryAuthority, addNewCategory);
router.post("/addGoods", checkInventoryAuthority, addNewGoods);
router.post("/modifyGood", checkInventoryAuthority, modifyGoodByItemId);
router.patch("/modifyCategory", checkInventoryAuthority, modifyCategoryById);
router.post(
  "/getCategoriesByQuery",
  checkInventoryAuthority,
  getCategoriesByQuery
);
router.post("/getGoodsByQuery", checkInventoryAuthority, getGoodsByQuery);
router.delete("/deleteGoods", checkInventoryAuthority, deleteGoodsByItemIds);
router.delete(
  "/deleteCategories",
  checkInventoryAuthority,
  deleteCategoriesByCategoryIds
);

export default router;
