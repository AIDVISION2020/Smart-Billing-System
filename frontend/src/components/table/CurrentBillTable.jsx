import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";
import { saveCurrentBill } from "../../indexedDB/indexedDB";
const CurrentBillTable = ({ currentBill, setCurrentBill }) => {
  const handleDeleteItem = (itemId) => {
    const updatedItems = currentBill.items.filter(
      (item) => item.itemId !== itemId
    );
    const updatedSubtotal = updatedItems.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    );
    const updatedTotalTax = updatedItems.reduce(
      (acc, item) => acc + Number(item.tax) * Number(item.quantity),
      0
    );
    const updatedTotalAmount = updatedSubtotal + updatedTotalTax;
    setCurrentBill({
      ...currentBill,
      items: updatedItems,
      subTotal: updatedSubtotal,
      totalTax: updatedTotalTax,
      totalAmount: updatedTotalAmount,
    });
    saveCurrentBill({
      ...currentBill,
      items: updatedItems,
      subTotal: updatedSubtotal,
      totalTax: updatedTotalTax,
      totalAmount: updatedTotalAmount,
    });
  };

  return (
    <table className="min-w-max text-sm text-left text-gray-700 dark:text-gray-300">
      <thead className="text-sm uppercase bg-gray-100 dark:bg-gray-900 dark:text-gray-400 font-bold">
        <tr>
          {[
            "Item ID",
            "Item Name",
            "Quantity / Weight(KG)",
            "Unit Price",
            "Total Price",
            "Tax Rate(%)",
            "Total Tax",
          ].map((header) => (
            <th
              key={header}
              scope="col"
              className="px-6 py-4 tracking-wide whitespace-nowrap"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {currentBill.items.map((good, index) => (
          <tr
            key={good.itemId}
            className={`border-b dark:border-gray-700 ${
              index % 2 === 0
                ? "bg-gray-50 dark:bg-gray-800"
                : "bg-white dark:bg-gray-900"
            } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all`}
          >
            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              {good.itemId}
            </td>
            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              {good.name}
            </td>
            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              {good.quantity}
            </td>
            <td className="px-6 py-4 text-md font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              ₹{(Number(good.price) || 0).toFixed(2)}
            </td>
            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              ₹
              {(
                (Number(good.price) || 0) * (Number(good.quantity) || 0)
              ).toFixed(2)}
            </td>
            <td className="px-6 py-4 font-semibold text-red-600 dark:text-red-400 whitespace-nowrap">
              {Number(good.taxRate).toFixed(2)}
            </td>
            <td className="px-6 py-4 font-semibold text-red-600 dark:text-red-400 whitespace-nowrap">
              ₹
              {((Number(good.tax) || 0) * (Number(good.quantity) || 0)).toFixed(
                2
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => handleDeleteItem(good.itemId)}
                className="text-red-500 hover:text-red-700 transition-all"
                title="Delete Item"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

CurrentBillTable.propTypes = {
  currentBill: PropTypes.object.isRequired,
  setCurrentBill: PropTypes.func.isRequired,
};

export default CurrentBillTable;
