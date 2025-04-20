import defineBillModel from "./bill.model.js";
import defineBillItemModel from "./billItem.model.js";

export const initBillModels = (branchId) => {
  const Bill = defineBillModel(branchId);
  const BillItem = defineBillItemModel(branchId);

  // One Bill has many BillItems
  Bill.hasMany(BillItem, {
    foreignKey: "billId",
    sourceKey: "billId",
    as: "items", // optional alias
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Each BillItem belongs to a Bill
  BillItem.belongsTo(Bill, {
    foreignKey: "billId",
    targetKey: "billId",
    as: "bill",
  });

  return { Bill, BillItem };
};
