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
    const categoryIds = category.map((catInst) => catInst.categoryId);
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

    if (!allGoods) {
      return res.status(500).json({
        error: "Failed to fetch goods",
      });
    }

    return res.status(200).json({ data: allGoods });
  } catch (error) {
    console.log("Error getting goods by category names: " + error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addNewCategory = async (req, res) => {
  try {
    const { branchId, category } = req.body;
    if (!branchId) {
      return res.status(400).json({ error: "Branch ID not provided" });
    }
    if (!(await Branch.findOne({ where: { branchId } }))) {
      return res.status(400).json({
        error: "This branch does not exist",
      });
    }

    if (!category) {
      return res.status(400).json({ error: "Category not provided" });
    }

    const branchCategory = defineCategoryModel(branchId);
    const categoryExists = await branchCategory.findOne({
      where: { name: category },
    });

    if (categoryExists) {
      return res.status(400).json({
        error: "Category already exists",
      });
    }

    const newCategory = await branchCategory.create({
      name: category,
      branchId,
    });

    return res.status(200).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.log("Error creating category: " + error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addNewGoods = async (req, res) => {
  try {
    const { goods: allGoods, branchId } = req.body;

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
    const goods = getFullGoods(allGoods);

    if (goods.length === 0) {
      return res.status(400).json({ error: "No goods provided" });
    }

    // Step 1: Count occurrences of each name
    const nameCounts = goods.reduce((acc, good) => {
      acc[good.name] = (acc[good.name] || 0) + 1;
      return acc;
    }, {});
    const uuidCounts = goods.reduce((acc, good) => {
      acc[good.uuid] = (acc[good.uuid] || 0) + 1;
      return acc;
    }, {});

    // Step 2: Filter out goods that appear more than once
    let uniqueGoods = goods.filter(
      (good) => nameCounts[good.name] === 1 && uuidCounts[good.uuid] === 1
    );

    let validGoods = [];

    for (const good of uniqueGoods) {
      const {
        name,
        price,
        description,
        quantity,
        tax,
        category,
        uuid,
        measurementType,
      } = good;
      const goodExists = await branchGood.findOne({
        where: {
          [Op.or]: [{ itemId: uuid }, { name }],
        },
      });
      if (goodExists) continue;

      let categoryInstance = await branchCategory.findOne({
        where: { name: category },
      });
      if (!categoryInstance) {
        categoryInstance = await branchCategory.create({ name: category });
      }

      validGoods.push({
        itemId: uuid,
        name,
        price,
        description,
        quantity,
        tax,
        categoryId: categoryInstance.categoryId,
        measurementType,
      });
    }

    await branchGood.bulkCreate(validGoods);
    return res
      .status(200)
      .json({ message: `${validGoods.length} goods created successfully` });
  } catch (error) {
    console.error("Error creating good:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const modifyCategoryById = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category?.categoryId)
      return res.status(400).json({ error: "Category ID is required" });
    const { branchId } = category;
    if (!branchId)
      return res.status(400).json({ error: "Branch ID is required" });
    const branchExists = await Branch.count({ where: { branchId } });
    if (!branchExists)
      return res.status(400).json({ error: "This branch does not exist" });

    const branchCategory = defineCategoryModel(branchId);

    const updateData = Object.fromEntries(
      Object.entries(category).filter(([, value]) => value !== undefined)
    );
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [updatedRows] = await branchCategory.update(updateData, {
      where: { categoryId: category.categoryId },
    });

    if (!updatedRows) {
      return res.status(404).json({ error: "No matching record found" });
    }

    return res.status(200).json({ message: "Category updated successful" });
  } catch (err) {
    console.error("Error updating category by id:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const modifyGoodByItemId = async (req, res) => {
  try {
    const { good, branchId } = req.body;

    if (!good?.itemId)
      return res.status(400).json({ error: "Item ID is required" });

    const branchExists = await Branch.count({ where: { branchId } });
    if (!branchExists)
      return res.status(400).json({ error: "This branch does not exist" });

    const branchGood = defineGoodsModel(branchId);
    const updateData = Object.fromEntries(
      Object.entries(good).filter(([, value]) => value !== undefined)
    );

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [updatedRows] = await branchGood.update(updateData, {
      where: { itemId: good.itemId },
    });

    if (!updatedRows) {
      return res.status(404).json({ error: "No matching record found" });
    }

    return res.status(200).json({ message: "Update successful" });
  } catch (err) {
    console.error("Error updating good by id:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteGoodsByItemIds = async (req, res) => {
  try {
    const { itemIds, branchId } = req.body;
    if (!branchId) return res.status(400).json({ error: "BranchId not found" });
    if (!itemIds || itemIds.length === 0)
      return res.status(400).json({ error: "ItemId not found" });
    if (!(await Branch.findOne({ where: { branchId } })))
      return res.status(400).json({ error: "This branch does not exist" });

    const branchGood = defineGoodsModel(branchId);
    const branchCategory = defineCategoryModel(branchId);

    const categories = await branchGood.findAll({
      attributes: ["categoryId"],
      where: {
        itemId: { [Op.in]: itemIds },
      },
      group: ["categoryId"], // Ensure unique category IDs
      raw: true,
    });

    const categoryIds = categories.map((cat) => cat.categoryId);

    const deletedRows = await branchGood.destroy({
      where: {
        itemId: { [Op.in]: itemIds },
      },
    });

    const categoriesToDelete = await branchGood.findAll({
      attributes: ["categoryId"],
      where: {
        categoryId: { [Op.in]: categoryIds },
      },
      group: ["categoryId"],
      raw: true,
    });

    const remainingCategoryIds = categoriesToDelete.map(
      (cat) => cat.categoryId
    );
    // Find the categories that are now empty
    const emptyCategoryIds = categoryIds.filter(
      (catId) => !remainingCategoryIds.includes(catId)
    );

    let resMsg =
      deletedRows === 0
        ? "Nothing to delete"
        : ` ${deletedRows} good deleted succesfully`;

    // Delete empty categories
    if (emptyCategoryIds.length > 0) {
      await branchCategory.destroy({
        where: {
          categoryId: { [Op.in]: emptyCategoryIds },
        },
      });

      resMsg += `, and ${emptyCategoryIds.length} category(ies) deleted since they had no items`;
    }

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
        : `${deletedRows} categories deleted successfully `;
    return res.status(200).json({ message: resMsg });
  } catch (err) {
    console.log("Error deleting categories by ids: " + err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getGoodsByQuery = async (req, res) => {
  try {
    const { branchId, query, catQuery } = req.body;
    if (!branchId) return res.status(400).json({ error: "BranchId not found" });
    if (!(await Branch.findOne({ where: { branchId } })))
      return res.status(400).json({ error: "This branch does not exist" });

    const branchGood = defineGoodsModel(branchId);
    const goods = await branchGood.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${query}%`,
                },
              },
              {
                itemId: {
                  [Op.like]: `%${query}%`,
                },
              },
            ],
          },
          ...(catQuery
            ? [
                {
                  categoryId: {
                    [Op.like]: `%${catQuery}%`,
                  },
                },
              ]
            : []),
        ],
      },
    });

    return res.status(200).json({ searchResults: goods });
  } catch (err) {
    console.log("Error getting goods by query: " + err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getFullGoods = (goods) => {
  let fullGoods = [];
  for (let good of goods) {
    if (isGoodValid(good)) {
      fullGoods.push(good);
    }
  }
  return fullGoods;
};

const isGoodValid = (good) => {
  if (!good) return false;
  const { name, price, description, quantity, tax, category } = good;
  if (
    !name ||
    price === null ||
    price === undefined ||
    !description ||
    quantity === null ||
    quantity === undefined ||
    tax === null ||
    tax === undefined ||
    !category
  ) {
    return false;
  }
  return true;
};
