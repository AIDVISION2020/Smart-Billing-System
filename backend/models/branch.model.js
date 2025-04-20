import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";

const Branch = sequelize.define(
  "Branch",
  {
    branchId: {
      type: DataTypes.STRING(10),
      primaryKey: true,
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    goodsTableName: {
      type: DataTypes.STRING(50),
    },
    categoriesTableName: {
      type: DataTypes.STRING(50),
    },
    billTableName: {
      type: DataTypes.STRING(50),
    },
    billItemTableName: {
      type: DataTypes.STRING(50),
    },
  },
  {
    tableName: "branches",
    timestamps: true,
  }
);

export default Branch;
