import propTypes from "prop-types";
import ConfirmModal from "../modals/ConfirmModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveCurrentBill, deleteBill } from "../../indexedDB/indexedDB";
import toast from "react-hot-toast";
import useCreateNewBill from "../../hooks/useCreateNewBill";
import { PagesLink } from "../../constants/constants";
import { useAuthContext } from "../../context/authContext";

const BillCheckout = ({ currentBill, setCurrentBill }) => {
  const [clearBillConfirmation, setClearBillConfirmation] = useState(false);

  const navigate = useNavigate();

  const confirmMessage = `Are you sure you want to clear the bill?`;
  const yesMessage = "Clear Bill";
  const noMessage = "Cancel";
  const toggalModalMessage = "Clear Bill";
  const { authUser } = useAuthContext();
  const branchId = authUser?.branchId;
  const generateBillId = () => {
    const timestamp = Date.now(); // in ms
    const base36 = timestamp.toString(36); // compact form
    return `${base36.slice(-7)}`; // total length = 2 + 7 = 9
  };

  const createNextBill = async () => {
    try {
      if (!branchId) {
        toast.error("New bill creation failed.");
        return;
      }
      const billId = generateBillId();
      const newBill = {
        customerName: "customer_" + billId,
        billId,
        billName: "bill_" + billId,
        branchId,
        items: [],
        totalAmount: 0,
        subTotal: 0,
        totalTax: 0,
        status: "pending", // New field to track bill status
        createdBy: authUser._id,
      };

      await saveCurrentBill(newBill);

      toast.success("Welcome to the next bill!");
      navigate(`${PagesLink.BILLING_TABLE.link}/${billId}`, { replace: true });
    } catch (error) {
      toast.error("Error creating new bill:", error);
    }
  };

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
        await deleteBill(currentBill.billId);
        await createNextBill();
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
            ₹{currentBill?.totalTax?.toFixed(2) / 2} + ₹
            {currentBill?.totalTax?.toFixed(2) / 2}
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
