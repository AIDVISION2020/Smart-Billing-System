import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";

const defineGoodsModel = (branchId) => {
  const tableName = `goods_${branchId}`; // Dynamic table name based on branchId

  return sequelize.define(
    "Goods",
    {
      itemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      categoryId: {
        references: {
          model: `categories_${branchId}`, // Dynamic reference to the correct categories table
          key: "categoryId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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
      timestamps: true, //to manage createdAt and updatedAt
    }
  );
};

export default defineGoodsModel;
