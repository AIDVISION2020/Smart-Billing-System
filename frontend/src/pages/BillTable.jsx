import { useState, useEffect, useRef } from "react";
import {
  checkBillExists,
  openDatabase,
  saveCurrentBill,
} from "../indexedDB/indexedDB";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import toast from "react-hot-toast";
import Spinner from "../components/spinner/Spinner";
import Bill_Customer_Name from "../components/bill_customer_name/Bill_Customer_Name";
import CurrentBill from "../components/billCheckout/CurrentBill";
import useGetGoodsByQuery from "../hooks/useGetGoodsByQuery";

const BillTable = () => {
  const { getGoods } = useGetGoodsByQuery();
  const { billId } = useParams();
  const navigate = useNavigate();

  const [currentBill, setCurrentBill] = useState(null);
  const [currGood, setCurrGood] = useState(null);
  const [newProductId, setNewProductId] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(1);
  const [filteredResults, setFilteredResults] = useState([]);
  const [productIdFocused, setProductIdFocused] = useState(false);

  const productIdRef = useRef(null);
  const quantityRef = useRef(null);

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
    if (productIdRef.current) productIdRef.current.focus();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (currentBill) {
        try {
          const results = await getGoods({
            branchId: currentBill.branchId,
            query: newProductId,
          });
          setFilteredResults(results);
        } catch (error) {
          console.error("Error fetching goods:", error);
        }
      } else {
        setFilteredResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [newProductId, currentBill, getGoods]);

  const addItemToBill = async () => {
    currGood.quantity = newProductQuantity;
    if (!currGood) return toast.error("No item selected to add to bill");
    if (currGood.quantity <= 0)
      return toast.error("Quantity must be greater than 0");
    if (currGood.quantity > currGood.maxQuantity)
      return toast.error("Quantity exceeds max allowed");

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
    setNewProductId("");
    setNewProductQuantity(1);
    productIdRef.current.focus();
  };

  const handleProductIdKeyDown = (e) => {
    if (e.key === "Enter" && filteredResults.length > 0) {
      e.preventDefault();
      const selected = filteredResults[0];
      setCurrGood({
        ...selected,
        quantity: newProductQuantity,
        maxQuantity: selected.quantity,
      });
      setTimeout(() => {
        quantityRef.current?.focus();
        quantityRef.current?.select();
      }, 50);
    }
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

          <div className="flex-grow flex flex-wrap flex-col items-center justify-center space-y-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 relative">
            {/* Input Form */}
            <div className="max-w-sm w-full rounded-2xl shadow-md bg-white dark:bg-gray-800 p-4 space-y-4 relative">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Add Item to Bill
              </h2>

              <input
                ref={productIdRef}
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="Enter Product ID"
                value={newProductId}
                onChange={(e) => setNewProductId(e.target.value)}
                onFocus={() => setProductIdFocused(true)}
                onBlur={() => setTimeout(() => setProductIdFocused(false), 200)}
                onKeyDown={handleProductIdKeyDown}
              />

              {/* Dropdown List */}
              {productIdFocused &&
                (filteredResults.length > 0 ? (
                  <ul className="absolute z-50 top-[110px] left-4 right-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md max-h-60 overflow-y-auto shadow-lg">
                    {filteredResults.map((item) => (
                      <div
                        key={item.itemId}
                        className="flex justify-evenly space-x-3 p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => {
                          setCurrGood({
                            ...item,
                            quantity: 1,
                            maxQuantity: item.quantity,
                            tax: (item.tax * item.price) / 100,
                            taxRate: item.tax,
                          });
                          setNewProductId(item.name);
                          setFilteredResults([]);
                        }}
                      >
                        <div className="flex flex-col space-y-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            ₹{item.price} | Stock: {item.quantity}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {item.itemId}
                          </span>
                        </div>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div className="absolute z-50 top-[90px] left-4 right-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      No results found, Try searching for a different product ID
                    </span>
                  </div>
                ))}

              <input
                ref={quantityRef}
                type="number"
                step="0.01"
                min={0}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                placeholder="Quantity / Weight"
                value={newProductQuantity === 0 ? "" : newProductQuantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewProductQuantity(val === "" ? 0 : parseFloat(val));
                }}
              />

              <button
                className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2 w-full transition duration-200 ${
                  !currGood ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={addItemToBill}
                disabled={!currGood}
              >
                Add Product
              </button>

              {currGood && (
                <button
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white font-semibold rounded-md p-2 w-full transition duration-200"
                  onClick={() => setCurrGood(null)}
                >
                  Cancel Item
                </button>
              )}
            </div>

            {/* Current Bill Display */}
            <div className=" w-full rounded-2xl shadow-md dark:bg-gray-800 p-4 space-y-4">
              <CurrentBill
                currentBill={currentBill}
                setCurrentBill={setCurrentBill}
              />
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
