import express from "express";
import {
  getBillSalesSummary,
  getBillItemsSalesSummary,
  getBranchSummary,
  getStockSummary,
} from "../controllers/analytics.controller.js";
import checkInventoryAuthority from "../middleware/checkInventoryAuthority.js";

const router = express.Router();

router.post(
  "/bill-sales-summary",
  checkInventoryAuthority,
  getBillSalesSummary
);
router.post(
  "/bill-items-sales-summary",
  checkInventoryAuthority,
  getBillItemsSalesSummary
);
router.post("/branch-summary", checkInventoryAuthority, getBranchSummary);
router.post("/stock-summary", checkInventoryAuthority, getStockSummary);
export default router;
