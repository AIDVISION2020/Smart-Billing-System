import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";

const defineBillItemModel = (branchId) => {
  const tableName = `billItem_${branchId}`;

  return sequelize.define(
    "Bill_Item",
    {
      billItemId: {
        type: DataTypes.STRING,
        defaultValue: () =>
          "billitem_" +
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 7),
        primaryKey: true,
      },
      billId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: `bill_${branchId}`,
          key: "billId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      itemId: {
        type: DataTypes.STRING,
        references: {
          model: `goods_${branchId}`,
          key: "itemId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      priceWhenBought: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
      purchasedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      taxWhenBought: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
      },
    },
    {
      tableName,
      timestamps: true,
    }
  );
};

export default defineBillItemModel;
