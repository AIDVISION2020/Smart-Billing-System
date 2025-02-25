import defineCategoryModel from "../models/category.model.js";
import defineGoodsModel from "../models/good.models.js";
import { Op } from "sequelize";
import Branch from "../models/branch.model.js";

export const getGoodByCategoryNames = async (req, res) => {
  try {
    // empty category array means all categories
    const { branchId, category } = req.body;
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID not provided" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category not provided" });
    }

    if (!(await Branch.findOne({ where: { branchId } }))) {
      return res.status(400).json({
        error: "This branch does not exist",
      });
    }
    const categoryIds = await getCategoryIdByCategoryName(category, branchId);
    const whereCondition =
      categoryIds.length > 0
        ? {
            categoryId: { [Op.in]: categoryIds },
          }
        : {};

    const branchGood = defineGoodsModel(branchId);
    const allGoods = await branchGood.findAll({
      where: whereCondition,
    });

    if (!allGoods || allGoods.length === 0) {
      return res.status(404).json({
        error: "No goods found for the specified categories",
        categories: category,
      });
    }

    return res.status(200).json({ data: allGoods });
  } catch (error) {
    console.log("Error getting goods by category names: " + error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addNewGood = async (req, res) => {
  try {
    const { good, branchId } = req.body;
    if (!isGoodNonEmpty(good)) {
      return res.status(400).json({ error: "Invalid good data" });
    }
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID not provided" });
    }
    if (!(await Branch.findOne({ where: { branchId } }))) {
      return res.status(400).json({
        error: "This branch does not exist",
      });
    }

    const branchCategory = defineCategoryModel(branchId);
    const branchGood = defineGoodsModel(branchId);

    const { name, price, description, quantity, tax, category } = good;
    const goodExists = await branchGood.findOne({ where: { name: name } });

    if (goodExists) {
      return res.status(400).json({ error: "Good already exists" });
    }
    let categoryInstance = await branchCategory.findOne({
      where: { name: category },
    });
    if (!categoryInstance) {
      categoryInstance = await branchCategory.create({ name: category });
    }

    await branchGood.create({
      name,
      price,
      description,
      quantity,
      tax,
      categoryId: categoryInstance.categoryId,
    });

    return res.status(200).json({ message: "Good created successfully" });
  } catch (error) {
    console.error("Error creating good:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const modifyGoodByItemId = async (req, res) => {
  try {
    const { good, branchId } = req.body;

    if (!good) {
      return res.status(400).json({ error: "Item data is required" });
    }
    const { name, description, tax, price, quantity, itemId } = good;
    if (!itemId) {
      return res.status(400).json({ error: "Item id is required" });
    }
    if (!(await Branch.findOne({ where: { branchId } }))) {
      return res.status(400).json({
        error: "This branch does not exist",
      });
    }

    const branchGood = defineGoodsModel(branchId);

    const updateData = Object.entries({
      name,
      description,
      tax,
      price,
      quantity,
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value; // Only add defined fields
      return acc;
    }, {});

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [updatedRows] = await branchGood.update(updateData, {
      where: { itemId: itemId },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "No matching record found" });
    }
    return res.status(200).json({ message: "Update successful" });
  } catch (err) {
    console.log("Error updating good by id: " + err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteGoodByItemId = async (req, res) => {
  try {
    const { itemIds, branchId } = req.body;
    if (!branchId) return res.status(400).json({ error: "BranchId not found" });
    if (!itemIds || itemIds.length === 0)
      return res.status(400).json({ error: "ItemId not found" });
    if (!(await Branch.findOne({ where: { branchId } })))
      return res.status(400).json({ error: "This branch does not exist" });

    const branchGood = defineGoodsModel(branchId);
    const deletedRows = await branchGood.destroy({
      where: {
        itemId: { [Op.in]: itemIds },
      },
    });
    const resMsg =
      deletedRows === 0
        ? "Nothing to delete"
        : `Rows deleted successfully: ${deletedRows}`;
    return res.status(200).json({ message: resMsg });
  } catch (err) {
    console.log("Error deleting good by item id: " + err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategoriesByCategoryIds = async (req, res) => {
  try {
    const { branchId, categoryIds } = req.body;
    if (!branchId) return res.status(400).json({ error: "BranchId not found" });
    if (!categoryIds || categoryIds.length === 0)
      return res.status(400).json({ error: "categories not found" });
    if (!(await Branch.findOne({ where: { branchId } })))
      return res.status(400).json({ error: "This branch does not exist" });

    const branchCategory = defineCategoryModel(branchId);
    const deletedRows = await branchCategory.destroy({
      where: {
        categoryId: { [Op.in]: categoryIds },
      },
    });

    const resMsg =
      deletedRows === 0
        ? "Nothing to delete"
        : `Rows deleted successfully: ${deletedRows}`;
    return res.status(200).json({ message: resMsg });
  } catch (err) {
    console.log("Error deleting categories by ids: " + err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const isGoodNonEmpty = (good) => {
  if (!good) return false;
  const { name, price, description, quantity, tax, category } = good;
  if (!name || !price || !description || !quantity || !tax || !category) {
    return false;
  }
  return true;
};

const getCategoryIdByCategoryName = async (categoryName, branchId) => {
  try {
    const branchCategory = defineCategoryModel(branchId);
    const categoryObjs = await branchCategory.findAll({
      where: {
        name: {
          [Op.in]: categoryName,
        },
      },
    });
    let categoryIds = [];
    categoryObjs.forEach((category) => {
      categoryIds.push(category.dataValues.categoryId);
    });
    return categoryIds;
  } catch (err) {
    console.error(
      `Error converting category name to category id: ${err.message}`
    );
  }
};
