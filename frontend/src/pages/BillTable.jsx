import { useState, useEffect } from "react";
import {
  checkBillExists,
  openDatabase,
  saveCurrentBill,
} from "../indexedDB/indexedDB";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { ReceiptPoundSterling } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../components/spinner/Spinner";
import AutomaticItemAddition from "../components/billItemsAddition/AutomaticItemAddition";
import ManualItemAddition from "../components/billItemsAddition/ManualItemAddition";
import Bill_Customer_Name from "../components/bill_customer_name/Bill_Customer_Name";
import ItemAdditionDetails from "../components/billItemsAddition/ItemAdditionDetails";
import CurrentBill from "../components/billCheckout/CurrentBill";
import CurrGoodDetails from "../components/billItemsAddition/CurrGoodDetails";

const BillTable = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [currentBill, setCurrentBill] = useState(null);
  const [itemAdditionMode, setItemAdditionMode] = useState(null); // "manual" or "auto" or null
  const [image, setImage] = useState(null);
  const [currGood, setCurrGood] = useState(null);
  const [currCategory, setCurrCategory] = useState(null);

  useEffect(() => {
    const checkIfBillExists = async () => {
      await openDatabase();
      const billExists = await checkBillExists(billId);
      if (!billExists) {
        toast.error(`Unfinished bill with id ${billId} not found`);
        navigate("/billing", { replace: true });
      } else {
        setCurrentBill(billExists);
      }
    };
    checkIfBillExists();
  }, [billId, navigate]);

  useEffect(() => {
    setCurrCategory(null);
    setCurrGood(null);
    setImage(null);
  }, [itemAdditionMode]);

  const addItemToBill = async () => {
    if (!currGood) return toast.error("No item selected to add to bill");
    if (currGood.quantity <= 0)
      return toast.error("No item selected to add to bill");
    if (currGood.quantity > currGood.maxQuantity)
      return toast.error("Quantity should be less than max quantity");
    const bill = { ...currentBill };
    const itemIndex = bill.items.findIndex(
      (item) => item.itemId === currGood.itemId
    );
    if (itemIndex !== -1) {
      bill.items[itemIndex].quantity += currGood.quantity;
    } else {
      delete currGood.maxQuantity;
      bill.items.push({ ...currGood });
    }
    bill.subTotal += currGood.price * currGood.quantity;
    bill.totalTax += currGood.tax * currGood.quantity;
    bill.totalAmount = bill.subTotal + bill.totalTax;

    await saveCurrentBill(bill);

    toast.success(`${currGood.name} added to bill`);
    setCurrentBill(bill);
    setCurrGood(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />
      {currentBill ? (
        <div className="flex flex-col h-full w-full overflow-y-auto">
          <Bill_Customer_Name
            currentBill={currentBill}
            setCurrentBill={setCurrentBill}
          />
          <div className="flex-grow flex flex-wrap items-center justify-evenly space-y-4 px-4 py-2 bg-gray-100 dark:bg-gray-800">
            {/* Left half - current product and it's quantity and metadata */}
            <div className="max-w-sm w-full rounded-2xl shadow-md bg-white dark:bg-gray-800 p-4 space-y-4">
              <div className="rounded-xl overflow-hidden w-full flex justify-center items-center p-2 border-dashed border-2 border-gray-300 dark:border-gray-600">
                {image ? (
                  <img
                    src={image}
                    alt="Product"
                    className="block h-48 w-auto object-contain"
                  />
                ) : (
                  <ReceiptPoundSterling
                    size={100}
                    className="text-gray-400 dark:text-gray-600"
                  />
                )}
              </div>

              {itemAdditionMode && (
                <ItemAdditionDetails
                  setItemAdditionMode={setItemAdditionMode}
                  itemAdditionMode={itemAdditionMode}
                />
              )}
              {currGood && (
                <CurrGoodDetails
                  currGood={currGood}
                  image={image}
                  setCurrGood={setCurrGood}
                />
              )}
              {currGood ? (
                <>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2 w-full transition duration-200"
                    onClick={() => {
                      addItemToBill();
                    }}
                  >
                    Add to bill
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2 w-full transition duration-200"
                    onClick={() => {
                      setCurrGood(null);
                    }}
                  >
                    Cancel Item
                  </button>
                </>
              ) : itemAdditionMode === null ? (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2 w-full transition duration-200"
                  onClick={() => {
                    setItemAdditionMode("auto");
                  }}
                >
                  Fetch New Item
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2 w-full transition duration-200"
                  onClick={() => {
                    setItemAdditionMode(null);
                  }}
                >
                  See Current Bill
                </button>
              )}
            </div>

            {/* Right half - current bill and total */}
            <div className="max-w-4xl w-full rounded-2xl shadow-md dark:bg-gray-800 p-4 space-y-4 ">
              {itemAdditionMode === "manual" ? (
                <ManualItemAddition
                  currCategory={currCategory}
                  setCurrCategory={setCurrCategory}
                  setCurrGood={setCurrGood}
                  setImage={setImage}
                  branchId={currentBill.branchId}
                />
              ) : itemAdditionMode === "auto" ? (
                <AutomaticItemAddition
                  currCategory={currCategory}
                  setCurrCategory={setCurrCategory}
                  setCurrGood={setCurrGood}
                  setImage={setImage}
                  branchId={currentBill.branchId}
                />
              ) : (
                <CurrentBill
                  currentBill={currentBill}
                  setCurrentBill={setCurrentBill}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <Spinner
          loadingMessageStyles={"text-4xl"}
          loadingMessage={"Fetching last saved context..."}
        />
      )}
    </div>
  );
};

export default BillTable;
