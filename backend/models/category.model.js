import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";

const defineCategoryModel = (branchId) => {
  const tableName = `categories_${branchId}`; // Dynamic table name based on branchId

  return sequelize.define(
    "Category",
    {
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
    },
    {
      tableName: tableName, // Set the dynamic table name
      timestamps: true,
    }
  );
};

export default defineCategoryModel;
