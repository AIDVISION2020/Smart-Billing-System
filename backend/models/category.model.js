import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";

const defineCategoryModel = (branchId) => {
  const tableName = `categories_${branchId}`; // Dynamic table name based on branchId

  return sequelize.define(
    "Category",
    {
      categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: tableName, // Set the dynamic table name
      timestamps: true,
    }
  );
};

export default defineCategoryModel;
