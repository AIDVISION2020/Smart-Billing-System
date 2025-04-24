import { initBillModels } from "../models/associateBillModes.js";
import Branch from "../models/branch.model.js"; // Import the Branch model if needed
import User from "../models/user.model.js"; // Import the User model if needed
import sequelize from "../db/connect.db.js"; // Import your Sequelize instance
import { Op } from "sequelize";
import defineGoodsModel from "../models/good.models.js";

export const createNewBill = async (req, res) => {
  try {
    const { newBill } = req.body;

    if (!newBill) {
      return res.status(400).json({ error: "Insufficient bill data" });
    }

    const {
      branchId,
      customerName,
      createdBy,
      items,
      subTotal,
      totalTax,
      totalDiscount = 0,
      totalAmount,
      billName,
    } = newBill;

    if (
      !branchId ||
      !customerName ||
      !createdBy ||
      !items ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing required bill fields or empty item list" });
    }

    const { Bill, BillItem } = initBillModels(branchId);

    await sequelize.transaction(async (t) => {
      // 1. Create the bill
      const bill = await Bill.create(
        {
          billName,
          createdBy,
          branchId,
          customerName,
          subTotal,
          totalTax,
          totalDiscount,
          totalAmount,
        },
        { transaction: t }
      );

      const billId = bill.billId;

      // 2. Add BillItems
      const billItemsData = items.map((item) => ({
        billId,
        itemId: item.itemId,
        priceWhenBought: item.price,
        purchasedQuantity: item.quantity,
        taxWhenBought: item.tax,
      }));

      await BillItem.bulkCreate(billItemsData, { transaction: t });
    });

    res.status(201).json({ message: "Bill created successfully" });
  } catch (err) {
    console.error("Error creating new bill:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchBills = async (req, res) => {
  try {
    const loggedInUser = req.user?.dataValues;

    const { billIds = [] } = req.body;
    const { userId } = loggedInUser;
    // If billIds array is empty then fetch all bills created by this user
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let bills = [],
      billItems = [];

    if (user.role === "admin") {
      const allBranches = await Branch.findAll();

      for (const branch of allBranches) {
        if (branch.branchId === "0") continue; // Skip the branch with ID "0"
        const { branchBills, branchBillItems } =
          await fetchBillsAndItemsForBranch(branch.branchId, billIds);

        bills.push(...branchBills);
        billItems.push(...branchBillItems);
      }
    } else {
      const branchId = user.branchId;
      const { branchBills, branchBillItems } =
        await fetchBillsAndItemsForBranch(branchId, billIds, userId);
      bills = branchBills;
      billItems = branchBillItems;
    }

    const itemsGroupedByBill = {};
    billItems.forEach((item) => {
      if (!itemsGroupedByBill[item.billId])
        itemsGroupedByBill[item.billId] = [];
      const goods = item.Good?.dataValues || {};
      itemsGroupedByBill[item.billId].push({
        billItemId: item.billItemId,
        itemId: item.itemId,
        purchasedQuantity: item.purchasedQuantity,
        priceWhenBought: item.priceWhenBought,
        taxWhenBought: item.taxWhenBought,
        ...goods, // merge with original item details (name, stock quantity, unit, etc.)
      });
    });

    const response = bills.map((bill) => ({
      billId: bill.billId,
      billName: bill.billName,
      customerName: bill.customerName,
      createdBy: bill.createdBy,
      subTotal: bill.subTotal,
      totalTax: bill.totalTax,
      totalDiscount: bill.totalDiscount,
      totalAmount: bill.totalAmount,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
      items: itemsGroupedByBill[bill.billId] || [],
    }));

    res.status(200).json({ data: response });
  } catch (err) {
    console.error("Error fetching bills:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const fetchBillsAndItemsForBranch = async (
  branchId,
  billIds = [],
  userId = null
) => {
  const { Bill, BillItem } = initBillModels(branchId);
  const Goods = defineGoodsModel(branchId);

  BillItem.belongsTo(Goods, {
    foreignKey: "itemId",
    targetKey: "itemId",
  });

  const billQuery = {
    ...(billIds.length && { billId: { [Op.in]: billIds } }),
    ...(userId && { createdBy: userId }),
  };

  const branchBills = await Bill.findAll({
    where: billQuery,
    order: [["createdAt", "DESC"]],
  });

  const ids = branchBills.map((bill) => bill.billId);

  const branchBillItems = await BillItem.findAll({
    where: { billId: { [Op.in]: ids } },
    include: [
      {
        model: Goods,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });

  return { branchBills, branchBillItems };
};
