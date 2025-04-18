import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { saveCurrentBill } from "../../indexedDB/indexedDB";
import toast from "react-hot-toast";

const Bill_Customer_Name = ({ currentBill, setCurrentBill }) => {
  const [changesMade, setChangesMade] = useState(false);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (currentBill && changesMade) {
        saveCurrentBill(currentBill)
          .then(() => {
            setChangesMade(false);
          })
          .catch((error) => {
            toast.error(`Error updating bill: ${error.message}`);
          });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [currentBill, changesMade]);
  return (
    <div className="flex w-full justify-evenly items-center flex-wrap gap-4 p-2">
      <div className="border-2 border-gray-300 dark:border-gray-700 px-4 py-2 rounded-2xl shadow-lg bg-white dark:bg-gray-900 w-fit mx-auto sm:my-4">
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Branch ID:
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            {currentBill.branchId}
          </span>
        </div>
      </div>
      <div className="flex align-center justify-center sm:justify-end flex-wrap flex-grow gap-2 w-fit">
        <div className="flex flex-col w-fit">
          <label
            htmlFor="billName"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Bill Name
          </label>
          <div className="flex items-center rounded-md shadow-sm overflow-hidden border border-gray-300 dark:border-gray-600">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm select-none">
              bill_
            </span>
            <input
              id="billName"
              type="text"
              maxLength={20}
              value={currentBill.billName.replace(/^bill_/, "")}
              onChange={(e) => {
                setCurrentBill((prev) => ({
                  ...prev,
                  billName: `bill_${e.target.value}`,
                }));
                setChangesMade(true);
              }}
              placeholder="enter name"
              className="px-2 py-1 w-36 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>

        <div className="flex flex-col w-fit">
          <label
            htmlFor="customerName"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Customer Name
          </label>
          <div className="flex items-center rounded-md shadow-sm overflow-hidden border border-gray-300 dark:border-gray-600">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm select-none">
              customer_
            </span>
            <input
              id="customerName"
              type="text"
              maxLength={20}
              value={currentBill.customerName.replace(/^customer_/, "")}
              onChange={(e) => {
                setCurrentBill((prev) => ({
                  ...prev,
                  customerName: `customer_${e.target.value}`,
                }));
                setChangesMade(true);
              }}
              placeholder="enter name"
              className="px-2 py-1 w-36 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Bill_Customer_Name.propTypes = {
  currentBill: propTypes.object.isRequired,
  setCurrentBill: propTypes.func.isRequired,
};

export default Bill_Customer_Name;
