import Branch from "../models/branch.model.js";
import defineCategoryModel from "../models/category.model.js";
import defineGoodsModel from "../models/good.models.js";
import defineBillItemModel from "../models/billItem.model.js";
import defineBillModel from "../models/bill.model.js";
import sequelize from "../db/connect.db.js";
import { Op } from "sequelize";
import { Roles } from "../utils/constants.js";

export const addNewBranchController = async (req, res) => {
  try {
    const { branchId, location } = req.body;
    if (!branchId || !location)
      return res
        .status(404)
        .json({ error: "BranchId and location are required" });
    if (await Branch.findOne({ where: { branchId } }))
      return res
        .status(400)
        .json({ error: "Branch with same id already exists" });

    await Branch.create({
      branchId,
      location,
      goodsTableName: `goods_${branchId}`,
      categoriesTableName: `categories_${branchId}`,
      billTableName: `bill_${branchId}`,
      billItemTableName: `billItem_${branchId}`,
    });

    const branchCategory = defineCategoryModel(branchId);
    const branchGood = defineGoodsModel(branchId);
    const branchBill = defineBillModel(branchId);
    const branchBillItem = defineBillItemModel(branchId);

    await branchCategory.sync(); // First, create category table
    await branchGood.sync(); // Then, create goods table with FK reference
    await branchBill.sync(); // Then, create bill table with FK reference
    await branchBillItem.sync(); // Finally, create bill item table with FK reference

    return res.status(200).json({
      message: "New branch added successfully",
    });
  } catch (err) {
    console.log("Error adding a new branch: " + err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBranchByIdController = async (req, res) => {
  try {
    const { branchId } = req.body;
    if (!branchId)
      return res.status(404).json({ error: "BranchId is required" });
    if (!(await Branch.findOne({ where: { branchId } })))
      return res
        .status(404)
        .json({ error: `Branch with id ${branchId} not found` });

    const deletedRows = await Branch.destroy({
      where: {
        branchId,
      },
    });
    let resMsg;
    if (deletedRows.length === 0) resMsg = "Nothing to delete";
    else {
      resMsg = `${deletedRows} branch deleted successfully`;
      await sequelize.getQueryInterface().dropTable(`billItem_${branchId}`);
      await sequelize.getQueryInterface().dropTable(`goods_${branchId}`);
      await sequelize.getQueryInterface().dropTable(`categories_${branchId}`);
      await sequelize.getQueryInterface().dropTable(`bill_${branchId}`);
    }

    return res.status(200).json({ message: resMsg });
  } catch (err) {
    console.log("Error deleting a branch: " + err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBranchController = async (req, res) => {
  try {
    const { oldBranchId, newBranchId: branchId, location } = req.body;
    if (!oldBranchId)
      return res.status(404).json({ error: "Old BranchId is required" });
    if (
      branchId &&
      (await Branch.findOne({
        where: { branchId },
      }))
    )
      return res.status(400).json({ error: "New BranchId is already present" });
    const updateData = Object.entries({
      branchId,
      location,
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value; // Only add defined fields
      return acc;
    }, {});
    if (updateData.branchId) {
      updateData.goodsTableName = `goods_${branchId}`;
      updateData.categoriesTableName = `categories_${branchId}`;
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [updatedRows] = await Branch.update(updateData, {
      where: { branchId: oldBranchId },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "No matching record found" });
    } else {
      await sequelize
        .getQueryInterface()
        .renameTable(`categories_${oldBranchId}`, `categories_${branchId}`);
      await sequelize
        .getQueryInterface()
        .renameTable(`goods_${oldBranchId}`, `goods_${branchId}`);
    }
    return res.status(200).json({ message: "Branch updated successfully" });
  } catch (err) {
    console.log("Error updating an existing branch: " + err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAccessibleBranchesController = async (req, res) => {
  try {
    const { role, branchId } = req.body;
    if (!role || !branchId)
      return res.status(400).json({ error: "Could not retrieve needed data" });

    const accessibleBranches = (
      await Branch.findAll({
        where:
          role !== Roles.ADMIN ? { branchId } : { branchId: { [Op.ne]: "0" } },
        attributes: ["branchId", "location"],
      })
    ).map((branch) => ({
      branchId: branch.branchId,
      location: branch.location,
    }));

    return res.status(200).json({
      accessibleBranches,
    });
  } catch (err) {
    console.log("Error while fetching accessible branches: ", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllCategoriesFromBranchId = async (req, res) => {
  try {
    const { branchId } = req.body;
    if (!branchId)
      return res.status(400).json({ error: "BranchId is required" });
    if (!(await Branch.findOne({ where: { branchId } })))
      return res.status(400).json({ error: "This branch does not exist" });

    const branchCategory = defineCategoryModel(branchId);
    const allCategories = await branchCategory.findAll({ raw: true });

    return res.status(200).json({
      allCategories,
    });
  } catch (err) {
    console.log("Error while fetching categories: ", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
