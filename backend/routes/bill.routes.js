import express from "express";
import { createNewBill, fetchBills } from "../controllers/bill.controller.js";
import checkBillingAuthority from "../middleware/checkBillingAuthority.js";

const router = express.Router();

router.post("/createNewBill", checkBillingAuthority, createNewBill);
router.post("/fetchBills", checkBillingAuthority, fetchBills);

export default router;
