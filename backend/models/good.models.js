import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";

const defineGoodsModel = (branchId) => {
  const tableName = `goods_${branchId}`; // Dynamic table name based on branchId

  return sequelize.define(
    "Goods",
    {
      itemId: {
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
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue:
          "https://cdn.pixabay.com/photo/2024/06/26/23/36/package-8856091_640.png",
      },
      measurementType: {
        type: DataTypes.ENUM("quantity", "weight"),
        allowNull: false,
        defaultValue: "quantity",
      },
    },
    {
      tableName: tableName, // Set the dynamic table name
      timestamps: true, //to manage createdAt and updatedAt
    }
  );
};

export default defineGoodsModel;
