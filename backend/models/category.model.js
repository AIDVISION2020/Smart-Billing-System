import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";

const defineCategoryModel = (branchId) => {
  const tableName = `categories_${branchId}`; // Dynamic table name based on branchId

  return sequelize.define(
    "Category",
    {
      branchId: {
        references: {
          model: "branches", // Reference to the branches table
          key: "branchId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.STRING,
        defaultValue: () =>
          Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue:
          "https://cdn.pixabay.com/photo/2024/06/26/23/36/package-8856091_640.png",
      },
    },
    {
      tableName: tableName, // Set the dynamic table name
      timestamps: true,
    }
  );
};

export default defineCategoryModel;
