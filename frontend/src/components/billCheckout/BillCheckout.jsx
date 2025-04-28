import propTypes from "prop-types";
import ConfirmModal from "../modals/ConfirmModal";
import { useState, useEffect } from "react";
import { saveCurrentBill } from "../../indexedDB/indexedDB";
import toast from "react-hot-toast";
import useCreateNewBill from "../../hooks/useCreateNewBill";

const BillCheckout = ({ currentBill, setCurrentBill }) => {
  const [clearBillConfirmation, setClearBillConfirmation] = useState(false);

  const confirmMessage = `Are you sure you want to clear the bill?`;
  const yesMessage = "Clear Bill";
  const noMessage = "Cancel";
  const toggalModalMessage = "Clear Bill";

  useEffect(() => {
    const clearBill = async () => {
      try {
        const newBill = {
          ...currentBill,
          items: [],
          subTotal: 0,
          totalTax: 0,
          totalAmount: 0,
        };
        await saveCurrentBill(newBill);
        toast.success("Bill cleared successfully!");
        setClearBillConfirmation(false);
        setCurrentBill(newBill);
      } catch (err) {
        toast.error("Error clearing bill: " + err.message);
      }
    };
    if (clearBillConfirmation) clearBill();
  }, [clearBillConfirmation, currentBill, setCurrentBill]);

  const { loading, createBill } = useCreateNewBill();

  const handleSaveBill = () => {
    if (!currentBill.items.length) {
      toast.error("No items in the bill to save!");
      return;
    }
    const createNewBill = async () => {
      try {
        await createBill({ newBill: currentBill });
        await saveCurrentBill({
          ...currentBill,
          completed: true,
        });
      } catch (err) {
        toast.error("Error creating bill: " + err.message);
      }
    };
    createNewBill();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {/* Subtotal Price */}
        <div className="flex justify-evenly items-center mt-4 space-x-2">
          <span className="text-gray-700 text-md font-semibold">Subtotal:</span>
          <span className="text-gray-700 text-md">
            ₹{currentBill?.subTotal?.toFixed(2)}
          </span>
        </div>
        {/* Total tax */}
        <div className="flex justify-evenly items-center mt-4 space-x-2">
          <span className="text-gray-700 text-md font-semibold">Tax: </span>
          <span className="text-gray-700 text-md">
            ₹{currentBill?.totalTax?.toFixed(2)}
          </span>
        </div>

        {/* Total Price */}
        <div className="flex justify-evenly items-center mt-4 space-x-2">
          <span className="text-gray-900 text-lg font-bold">Total:</span>
          <span className="text-gray-900 text-lg font-semibold">
            ₹{currentBill?.totalAmount?.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap justify-around px-4 items-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 w-auto transition duration-200"
          onClick={handleSaveBill}
          disabled={loading}
        >
          Generate Bill
        </button>
        <ConfirmModal
          confirmMessage={confirmMessage}
          yesMessage={yesMessage}
          noMessage={noMessage}
          toggalModalMessage={toggalModalMessage}
          setResponse={setClearBillConfirmation}
          negativeElement={true}
        />
      </div>
    </>
  );
};

BillCheckout.propTypes = {
  currentBill: propTypes.object.isRequired,
  setCurrentBill: propTypes.func.isRequired,
};

export default BillCheckout;
