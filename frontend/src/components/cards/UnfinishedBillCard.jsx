import { useState } from "react";
import PropTypes from "prop-types";
import { deleteBill } from "../../indexedDB/indexedDB";
import {
  CircleUserRound,
  Pencil,
  Trash2,
  ShoppingCart,
  HandCoins,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

const UnfinishedBillCard = ({ bill, setUpdatedBillListCnt }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const converDate = (lastUpdate) => {
    return lastUpdate
      ? new Date(lastUpdate).toLocaleString()
      : new Date(
          bill.billName.split("_").slice(1).join("_").replace(/_/g, ":")
        ).toLocaleString();
  };
  const lastUpdated = converDate(bill.timestamp);

  const handleDeletion = async (billName) => {
    try {
      await deleteBill(billName);
      toast.success("Bill deleted successfully!");
      setShowDeleteConfirm(false);
      setUpdatedBillListCnt((prev) => prev + 1);
    } catch (error) {
      toast.error("Error deleting bill:", error.message);
      console.error("Error deleting bill:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative overflow-hidden flex rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800 w-full">
      {/* Slide-over Left Section */}
      <div
        className={`flex flex-col justify-center items-center transition-all duration-500 ease-in-out ${
          showDeleteConfirm ? "w-full" : "w-1/3"
        } bg-purple-100 dark:bg-purple-900 rounded-l-3xl p-6`}
      >
        {!showDeleteConfirm ? (
          <>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-md inline-block">
              <CircleUserRound
                size={60}
                className="text-purple-600 dark:text-purple-300"
              />
            </div>
            <p className="mt-3 w-full text-sm sm:text-md font-bold text-purple-800 dark:text-purple-200 text-center break-words max-w-[220px]">
              {bill.customerName || "Unknown Customer"}
            </p>
          </>
        ) : (
          <div className="text-center space-y-3">
            <AlertTriangle
              size={40}
              className="text-black dark:text-red-200 mx-auto mb-2"
            />

            <p className="text-sm text-black dark:text-red-200 font-semibold">
              Delete bill{" "}
              <span className="underline underline-offset-2">
                {bill.billName || "Unknown bill"}
              </span>{" "}
              for{" "}
              <span className="underline underline-offset-2">
                {bill.customerName || "Unknown Customer"}
              </span>
              ?
            </p>
            <p className="text-xs text-black dark:text-gray-200">
              Last updated at:{" "}
              <span className="font-medium">{lastUpdated}</span>
            </p>

            <div className="flex flex-col gap-2 mt-3">
              <button
                onClick={() => handleDeletion(bill.billName)}
                className="bg-white dark:bg-gray-200 text-red-600 font-bold py-2 px-4 rounded-xl shadow hover:bg-gray-100 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={cancelDelete}
                className="text-sm text-black dark:text-gray-300 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Hidden when delete confirm is active */}
      {!showDeleteConfirm && (
        <div className="flex-1 flex flex-col justify-between gap-y-2 p-6 bg-white dark:bg-gray-800 rounded-r-3xl transition-all duration-500 ease-in-out">
          <span className="font-extrabold capitalize sm:text-xl">
            {bill.billName || "Unknown bill"}
          </span>
          <div className="space-y-3 mb-4 flex flex-col items-center">
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <ShoppingCart
                size={18}
                className="mr-2 text-blue-500 dark:text-blue-400"
              />
              <span className="mr-1">Items:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {bill.items.length}
              </span>
            </div>

            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <HandCoins
                size={18}
                className="mr-2 text-green-600 dark:text-green-400"
              />
              <span className="mr-1">Amount:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ₹{bill.totalAmount}
              </span>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last Updated:{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                {lastUpdated}
              </span>
            </div>
          </div>
          <div className="flex w-full justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-700">
            <button
              className="text-sm font-semibold px-5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center"
              onClick={() => {
                console.log("Editing:", bill.billName);
              }}
            >
              <Pencil size={16} className="mr-2" /> Edit Bill
            </button>

            <button
              className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 flex items-center"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete bill"
            >
              <Trash2 size={20} className="mr-1" />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

UnfinishedBillCard.propTypes = {
  bill: PropTypes.object.isRequired,
  setUpdatedBillListCnt: PropTypes.func.isRequired,
};

export default UnfinishedBillCard;
