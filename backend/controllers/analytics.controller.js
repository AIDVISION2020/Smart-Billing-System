import { initBillModels } from "../models/associateBillModes.js";
import Branch from "../models/branch.model.js";
import defineGoodsModel from "../models/good.models.js";
import defineCategoryModel from "../models/category.model.js";
import { Op } from "sequelize";

const checkValidBranch = async (branchId) => {
  try {
    if (!branchId) {
      throw new Error("Branch ID is required");
    }
    const branch = await Branch.findOne({ where: { branchId } });
    if (!branch) {
      throw new Error("Branch not found");
    }
    return branch;
  } catch (error) {
    console.error("Error checking branch:", error);
    throw new Error("Internal server error");
  }
};

const checkValidDates = (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new Error("Start and end dates are required");
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }
  if (start > end) {
    throw new Error("Start date cannot be after end date");
  }
};

// SALES SUMMARY BEGIN
export const getBillSalesSummary = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.body;
    await checkValidBranch(branchId);
    checkValidDates(startDate, endDate);

    const branchQuery = {
      ...(branchId !== "0" && { branchId: branchId }),
    };
    const branches = await Branch.findAll({
      where: branchQuery,
    });

    let billData = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    for (const branch of branches) {
      if (branch.branchId === "0") continue; // Skip the branch with ID "0"
      const { Bill } = initBillModels(branch.branchId);
      const bills = await Bill.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end],
          },
        },
      });

      const branchBillData = bills.map((bill) => {
        return {
          billId: bill.billId,
          totalAmount: bill.totalAmount,
          totalTax: bill.totalTax,
          subTotal: bill.subTotal,
          createdAt: bill.createdAt,
        };
      });
      billData.push(...branchBillData);
    }

    return res.status(200).json({
      data: billData,
    });
  } catch (error) {
    console.error("Error getting Bill Sales summary:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getBillItemsSalesSummary = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.body;
    await checkValidBranch(branchId);
    checkValidDates(startDate, endDate);

    const branchQuery = {
      ...(branchId !== "0" && { branchId: branchId }),
    };
    const branches = await Branch.findAll({ where: branchQuery });

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Aggregate items
    const itemMap = new Map(); // itemId => { itemId, name, purchasedQuantity }

    for (const branch of branches) {
      if (branch.branchId === "0") continue;

      const { BillItem } = initBillModels(branch.branchId);
      const Goods = defineGoodsModel(branch.branchId);

      const billItems = await BillItem.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end],
          },
        },
      });

      const itemIds = [...new Set(billItems.map((item) => item.itemId))];

      // Get item names in bulk
      const goods = await Goods.findAll({
        where: {
          itemId: itemIds,
        },
        attributes: ["itemId", "name"],
      });

      const nameMap = Object.fromEntries(goods.map((g) => [g.itemId, g.name]));

      for (const item of billItems) {
        const existing = itemMap.get(item.itemId);
        if (existing) {
          existing.purchasedQuantity += item.purchasedQuantity;
        } else {
          itemMap.set(item.itemId, {
            itemId: item.itemId,
            name: nameMap[item.itemId] || "Unnamed Item",
            purchasedQuantity: item.purchasedQuantity,
            priceWhenBought: item.priceWhenBought,
            taxWhenBought: item.taxWhenBought,
          });
        }
      }
    }

    const combinedItems = [...itemMap.values()];

    return res.status(200).json({ data: combinedItems });
  } catch (error) {
    console.error("Error getting BillItems sales summary:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// SALES SUMMARY END

// BRANCH SUMMARY BEGIN
export const getBranchSummary = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.body;
    await checkValidBranch(branchId);
    checkValidDates(startDate, endDate);

    const branchQuery = {
      ...(branchId !== "0" && { branchId: branchId }),
    };
    const branches = await Branch.findAll({
      where: branchQuery,
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    let branchMap = new Map(); // branchId => { totalSales, totalTax, totalItemsSold, totalDiscount, [categories] }

    for (const branch of branches) {
      const branchId = branch.branchId;
      if (branchId === "0") continue; // Skip the branch with ID "0"
      const { Bill, BillItem } = initBillModels(branchId);
      const billItems = await BillItem.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end],
          },
        },
      });
      const bills = await Bill.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end],
          },
        },
      });
      const branchSummaryData = getBranchSummaryData(bills, billItems);
      const categoriesForBranch = await getCategorySummary(
        branchId,
        start,
        end,
        billItems
      );
      branchMap.set(branchId, {
        branchId,
        location: branch.location,
        ...branchSummaryData,
        categoriesData: categoriesForBranch,
      });
    }

    return res.status(200).json({ data: Array.from(branchMap.values()) });
  } catch (error) {
    console.error("Error getting Branch summary:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getBranchSummaryData = (bills, billItems) => {
  const totalSales = bills.reduce(
    (acc, bill) => acc + Number(bill.totalAmount),
    0
  );
  const totalTax = bills.reduce((acc, bill) => acc + Number(bill.totalTax), 0);
  const totalItemsSold = billItems.reduce(
    (acc, item) => acc + Number(item.purchasedQuantity),
    0
  );
  const totalDiscount = bills.reduce(
    (acc, bill) => acc + Number(bill.totalDiscount),
    0
  );
  const totalBills = bills.length;

  return {
    totalBills,
    totalSales,
    totalTax,
    totalItemsSold,
    totalDiscount,
  };
};

const getCategorySummary = async (branchId, startDate, endDate, billItems) => {
  try {
    const Goods = defineGoodsModel(branchId);
    const Category = defineCategoryModel(branchId);
    const itemIds = [...new Set(billItems.map((item) => item.itemId))];
    const goods = await Goods.findAll({
      where: {
        itemId: {
          [Op.in]: itemIds,
        },
      },
    });

    const categoryIds = new Set();
    const goodsMap = new Map();
    for (const good of goods) {
      goodsMap.set(good.itemId, {
        name: good.name,
        categoryId: good.categoryId,
      });
      categoryIds.add(good.categoryId);
    }

    const categories = await Category.findAll({
      where: {
        categoryId: {
          [Op.in]: [...categoryIds],
        },
      },
    });

    const categoryNameMap = new Map();
    for (const category of categories) {
      categoryNameMap.set(category.categoryId, category.name);
    }

    const categoryMap = new Map(); // category => { totalSales, totalTax, totalItemsSold, totalDiscount, name, [items], branchId }
    const itemMap = new Map(); // itemId => { itemId, name, totalItemsSold, totalSales, totalTax, categoryId }

    for (const item of billItems) {
      const itemInfo = goodsMap.get(item.itemId);
      if (!itemInfo) continue;
      const { name, categoryId } = itemInfo;
      const categoryName = categoryNameMap.get(categoryId) || "Unknown";

      if (!itemMap.has(item.itemId)) {
        itemMap.set(item.itemId, {
          itemId: item.itemId,
          name,
          totalItemsSold: 0,
          totalSales: 0,
          totalTax: 0,
          categoryId,
          totalBills: 0,
        });
      }

      const itemSummary = itemMap.get(item.itemId);
      itemSummary.totalItemsSold += Number(item.purchasedQuantity);
      itemSummary.totalSales +=
        Number(item.priceWhenBought) * Number(item.purchasedQuantity);
      itemSummary.totalTax +=
        Number(item.taxWhenBought) * Number(item.purchasedQuantity);
      itemSummary.totalBills += 1;

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          categoryId,
          categoryName,
          totalSales: 0,
          totalTax: 0,
          totalItemsSold: 0,
          items: [],
          totalBills: 0,
        });
      }

      const category = categoryMap.get(categoryId);
      category.totalSales +=
        Number(item.priceWhenBought) * Number(item.purchasedQuantity);
      category.totalTax +=
        Number(item.taxWhenBought) * Number(item.purchasedQuantity);
      category.totalItemsSold += Number(item.purchasedQuantity);
      category.totalBills += 1;
    }

    for (const item of itemMap.values()) {
      const category = categoryMap.get(item.categoryId);
      if (category) {
        category.items.push(item);
      }
    }

    return Array.from(categoryMap.values());
  } catch (error) {
    console.error("Error getting Category summary:", error);
    throw new Error("Internal server error");
  }
};
// BRANCH SUMMARY END

// STOCK SUMMARY BEGIN
// export const getStockSummary = async (req, res) => {
//   try {
//     const { branchId, startDate, endDate } = req.body;
//     await checkValidBranch(branchId);
//     checkValidDates(startDate, endDate);

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     end.setHours(23, 59, 59, 999);

//     const { BillItem } = initBillModels(branchId);
//     const Goods = defineGoodsModel(branchId);

//     const billItems = await BillItem.findAll({
//       where: {
//         createdAt: {
//           [Op.between]: [start, end],
//         },
//       },
//     });

//     const itemIds = [...new Set(billItems.map((item) => item.itemId))];

//     const goods = await Goods.findAll({
//       where: {
//         itemId: {
//           [Op.in]: itemIds,
//         },
//       },
//     });

//     // Aggregate item-level stats
//     const itemSalesMap = new Map();

//     for (const item of billItems) {
//       const { itemId, quantity, price, taxAmount } = item;

//       if (!itemSalesMap.has(itemId)) {
//         itemSalesMap.set(itemId, {
//           itemId,
//           totalItemsSold: 0,
//           totalSales: 0,
//           totalTax: 0,
//         });
//       }

//       const current = itemSalesMap.get(itemId);

//       current.totalItemsSold += Number(quantity);
//       current.totalSales += Number(price);
//       current.totalTax += Number(taxAmount);

//       itemSalesMap.set(itemId, current);
//     }

//     const enrichedItems = goods.map((item) => {
//       const stats = itemSalesMap.get(item.itemId) || {
//         totalItemsSold: 0,
//         totalSales: 0,
//         totalTax: 0,
//       };

//       return {
//         itemId: item.itemId,
//         name: item.name,
//         categoryId: item.categoryId,
//         stock: Number(item.quantity), // typecast for safety
//         ...stats,
//       };
//     });

//     return res.json({ data: enrichedItems });
//   } catch (error) {
//     console.error("Error getting Stock summary:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// Label items based on stock thresholds
const getItemLabel = (stock, lowThreshold = 10, overstockThreshold = 100) => {
  if (stock <= lowThreshold) return "low-stock";
  if (stock >= overstockThreshold) return "overstocked";
  return "normal";
};

/**
 * Attach label and categoryName to each item
 */
const getItemDetails = (goods, categoryNameMap) => {
  return goods.map((g) => {
    const stock = Number(g.quantity || 0);
    const label = getItemLabel(stock);
    return {
      itemId: g.itemId,
      name: g.name,
      categoryId: g.categoryId,
      categoryName: categoryNameMap[g.categoryId] || "Unknown Category",
      stock,
      unitPrice: Number(g.price || 0),
      label,
    };
  });
};

/**
 * Compute stock valuation for each item
 */
const getStockValuation = (items) =>
  items.map((item) => ({
    ...item,
    stockValue: Number(item.unitPrice) * Number(item.stock),
  }));

/**
 * Aggregate items by category for stock breakdown
 */
const getCategoryBreakdown = (items) => {
  const map = {};

  items.forEach((item) => {
    const { categoryId, categoryName, stock, stockValue } = item;
    if (!map[categoryId]) {
      map[categoryId] = {
        categoryId,
        categoryName,
        totalStock: 0,
        uniqueItemCount: 0,
        lowStockCount: 0,
        lowStocks: [],
        stockValue: 0,
      };
    }
    const cat = map[categoryId];
    cat.totalStock += stock;
    cat.uniqueItemCount += 1;
    cat.stockValue += stockValue;
    if (item.label === "low-stock") {
      cat.lowStocks.push({ itemId: item.itemId, name: item.name, stock });
      cat.lowStockCount += 1;
    }
  });
  return Object.values(map);
};

// Main controller
export const getStockSummary = async (req, res) => {
  try {
    const { branchId } = req.body;
    await checkValidBranch(branchId);

    const Goods = defineGoodsModel(branchId);
    const Category = defineCategoryModel(branchId);

    const goods = await Goods.findAll({});

    // fetch category names
    const categoryIds = [...new Set(goods.map((g) => g.categoryId))];
    const categories = await Category.findAll({
      where: { categoryId: { [Op.in]: categoryIds } },
    });
    const categoryNameMap = categories.reduce((acc, c) => {
      acc[c.categoryId] = c.name;
      return acc;
    }, {});

    // build item details with labels and category names
    const itemDetails = getItemDetails(goods, categoryNameMap);

    // attach valuation
    const itemsWithValuation = getStockValuation(itemDetails);

    // category-level breakdown
    const categoriesBreakdown = getCategoryBreakdown(itemsWithValuation);

    return res.status(200).json({
      items: itemsWithValuation,
      categories: categoriesBreakdown,
    });
  } catch (error) {
    console.error("Error in getStockSummary:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
