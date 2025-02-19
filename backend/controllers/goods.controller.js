import sequelize from "../db/connect.db.js";
import defineCategoryModel from "../models/category.model.js";
import defineGoodsModel from "../models/good.models.js";
import { Op } from "sequelize";

export const getGoodByCategoryNames = async (req, res) => {
  try {
    // empty category array means all categories
    const { branchId, category } = req.body;
    if (!branchId) {
      return res.status(400).json({ message: "Branch ID not provided" });
    }
    if (!category) {
      return res.status(400).json({ message: "Category not provided" });
    }
    if (!(await checkIfTableExists(`categories_${branchId}`))) {
      return res.status(400).json({
        message: "Table does not exist",
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
        message: "No goods found for the specified categories",
        categories: category,
      });
    }

    return res.status(200).json({ data: allGoods });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addNewGood = async (req, res) => {
  try {
    const { good, branchId } = req.body;
    if (!isGoodNonEmpty(good)) {
      return res.status(400).json({ message: "Invalid good data" });
    }
    if (!branchId) {
      return res.status(400).json({ message: "Branch ID not provided" });
    }
    if (!(await checkIfTableExists(`categories_${branchId}`))) {
      await makeNewTable(branchId);
    }

    const branchCategory = defineCategoryModel(branchId);
    const branchGood = defineGoodsModel(branchId);

    const { name, price, description, quantity, tax, category } = good;
    const goodExists = await branchGood.findOne({ where: { name: name } });
    if (goodExists) {
      return res.status(400).json({ message: "Good already exists" });
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
    console.log("New good created");
    return res.status(200).json({ message: "Good created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const modifyGoodByItemId = async (req, res) => {
  try {
    const { good, branchId } = req.body;

    if (!good) {
      return res.status(400).json({ message: "Item data is required" });
    }
    const { name, description, tax, price, quantity, itemId } = good;
    if (!itemId) {
      return res.status(400).json({ message: "Item id is required" });
    }
    if (!(await checkIfTableExists(`categories_${branchId}`))) {
      return res.status(400).json({
        message: "Table does not exist",
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
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const [updatedRows] = await branchGood.update(updateData, {
      where: { itemId: itemId },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "No matching record found" });
    }

    console.log(updatedRows);
    return res.status(200).json({ message: "Update successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteGoodByItemId = async (req, res) => {
  try {
    const { itemIds, branchId } = req.body;
    if (!branchId)
      return res.status(400).json({ message: "BranchId not found" });
    if (!itemIds || itemIds.length === 0)
      return res.status(400).json({ message: "ItemId not found" });
    if (!(await checkIfTableExists(`categories_${branchId}`)))
      return res.status(400).json({ message: "Table does not exist" });

    const branchGood = defineGoodsModel(branchId);
    const deletedRows = await branchGood.destroy({
      where: {
        itemId: { [Op.in]: itemIds },
      },
    });
    const resMsg =
      deletedRows === 0
        ? "Nothing to delete"
        : `Rows deleted successfully + ${deletedRows}`;
    return res.status(200).json({ message: resMsg });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteCategoriesByCategoryIds = async (req, res) => {
  try {
    const { branchId, categoryIds } = req.body;
    if (!branchId)
      return res.status(400).json({ message: "BranchId not found" });
    if (!categoryIds || categoryIds.length === 0)
      return res.status(400).json({ message: "categories not found" });
    if (!(await checkIfTableExists(`categories_${branchId}`)))
      return res.status(400).json({ message: "Table does not exist" });

    const branchCategory = defineCategoryModel(branchId);
    const deletedRows = await branchCategory.destroy({
      where: {
        categoryId: { [Op.in]: categoryIds },
      },
    });

    const resMsg =
      deletedRows === 0
        ? "Nothing to delete"
        : `Rows deleted successfully + ${deletedRows}`;
    return res.status(200).json({ message: resMsg });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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

const checkIfTableExists = async (tableName) => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllSchemas();

    const tableExists = tables.some((schema) => {
      return schema.Tables_in_goods_management === tableName;
    });
    // console.log(tables);
    console.log(`Table ${tableName} exists:`, tableExists);
    return tableExists;
  } catch (error) {
    console.error(`Error checking table existence for ${tableName}:`, error);
    return false;
  }
};

const makeNewTable = async (branchId) => {
  try {
    const Category = defineCategoryModel(branchId);
    const Goods = defineGoodsModel(branchId);
    await Category.sync({ force: false });
    await Goods.sync({ force: false });
    console.log("New table created successfully");
  } catch (err) {
    console.log("Error while creating new table", err);
  }
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
