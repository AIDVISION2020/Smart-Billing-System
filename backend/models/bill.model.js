import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";

const defineBillModel = (branchId) => {
  const tableName = `bill_${branchId}`; // Dynamic table name based on branchId

  return sequelize.define(
    "Bills",
    {
      billId: {
        type: DataTypes.STRING,
        defaultValue: () =>
          "bill_" +
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 7),
        primaryKey: true,
      },
      billName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdBy: {
        references: {
          model: "users", // Reference to the users table
          key: "userId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        type: DataTypes.STRING,
      },
      branchId: {
        references: {
          model: "branches", // Reference to the branches table
          key: "branchId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        type: DataTypes.STRING,
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subTotal: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      totalTax: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      totalDiscount: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
    },
    {
      tableName: tableName, // Set the dynamic table name
      timestamps: true, //to manage createdAt and updatedAt
    }
  );
};

export default defineBillModel;
