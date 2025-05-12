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
  const [categoryId, setCategoryId] = useState("");
  const [newProductId, setNewProductId] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(1); // Changed default to 1 instead of 0
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchFieldsFocused, setSearchFieldsFocused] = useState(false);

  const productIdRef = useRef(null);
  const categoryIdRef = useRef(null);
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
            catQuery: categoryId,
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
  }, [newProductId, currentBill, getGoods, categoryId]);

  const selectProduct = (item) => {
    // Create a clean copy of the item with needed properties
    const selectedGood = {
      ...item,
      quantity: 1,
      maxQuantity: item.quantity,
      tax: (item.tax * item.price) / 100,
      taxRate: item.tax,
    };

    // Update state variables
    setCurrGood(selectedGood);
    setNewProductId(item.name);
    setFilteredResults([]);
    setSearchFieldsFocused(false); // Hide dropdown after selection

    // Focus on quantity field
    setTimeout(() => {
      if (quantityRef.current) {
        quantityRef.current.focus();
        quantityRef.current.select();
      }
    }, 50);
  };

  const addItemToBill = async () => {
    if (!currGood) return toast.error("No item selected to add to bill");
    if (newProductQuantity <= 0)
      return toast.error("Quantity must be greater than 0");
    if (newProductQuantity > currGood.maxQuantity)
      return toast.error("Quantity exceeds max available stock");

    // Create a copy of the current good with the updated quantity
    const itemToAdd = { ...currGood, quantity: newProductQuantity };

    const bill = { ...currentBill };
    const itemIndex = bill.items.findIndex(
      (item) => item.itemId === itemToAdd.itemId
    );
    if (itemIndex !== -1) {
      bill.items[itemIndex].quantity += itemToAdd.quantity;
    } else {
      const cleanItem = { ...itemToAdd };
      delete cleanItem.maxQuantity;
      bill.items.push(cleanItem);
    }
    bill.subTotal += itemToAdd.price * itemToAdd.quantity;
    bill.totalTax += itemToAdd.tax * itemToAdd.quantity;
    bill.totalAmount = bill.subTotal + bill.totalTax;

    await saveCurrentBill(bill);

    toast.success(`${itemToAdd.name} added to bill`);
    setCurrentBill(bill);
    setCurrGood(null);
    setNewProductId("");
    setNewProductQuantity(1);
    if (productIdRef.current) productIdRef.current.focus();
  };

  const handleProductIdKeyDown = (e) => {
    if (e.key === "Enter" && filteredResults.length > 0) {
      e.preventDefault();
      selectProduct(filteredResults[0]);
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
            <div className="max-w-sm w-full rounded-2xl shadow-md bg-white dark:bg-gray-800 p-4 space-y-4 relative items-center flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Add Item to Bill
              </h2>

              <div className="w-[300px] max-w-[85%] mx-auto space-y-3">
                <input
                  ref={categoryIdRef}
                  type="text"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Category ID (optional)"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  onFocus={() => {
                    setSearchFieldsFocused(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      const active = document.activeElement;
                      if (
                        active !== categoryIdRef.current &&
                        active !== productIdRef.current
                      ) {
                        setSearchFieldsFocused(false);
                      }
                    }, 100);
                  }}
                  onKeyDown={handleProductIdKeyDown}
                />

                <div className="relative">
                  <input
                    ref={productIdRef}
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter Product ID or Name"
                    value={newProductId}
                    onChange={(e) => setNewProductId(e.target.value)}
                    onFocus={() => {
                      setSearchFieldsFocused(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        const active = document.activeElement;
                        if (
                          active !== categoryIdRef.current &&
                          active !== productIdRef.current
                        ) {
                          setSearchFieldsFocused(false);
                        }
                      }, 100);
                    }}
                    onKeyDown={handleProductIdKeyDown}
                  />

                  {searchFieldsFocused && filteredResults.length > 0 && (
                    <div
                      className={`absolute z-50 top-full left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl overflow-y-auto max-h-60 mt-1 transition-all w-[90vw] max-w-[800px]`}
                    >
                      <div
                        className={`grid gap-4 p-4 ${
                          filteredResults.length > 1
                            ? "grid-cols-1 sm:grid-cols-2"
                            : "grid-cols-1"
                        }`}
                      >
                        {filteredResults.map((item) => (
                          <div
                            key={item.itemId}
                            className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md hover:bg-blue-50 dark:hover:bg-gray-600 transition cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent blur before click
                              selectProduct(item);
                            }}
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md mr-3 flex-shrink-0 border border-gray-300 dark:border-gray-600"
                            />
                            <div className="flex flex-col justify-between overflow-hidden min-w-0">
                              <span className="font-semibold text-gray-900 dark:text-white truncate">
                                {item.name}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                ₹{item.price} | Stock: {item.quantity}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                ID: {item.itemId}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                Category: {item.categoryId}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={quantityRef}
                  type="number"
                  step="0.01"
                  min={0.01}
                  max={currGood?.maxQuantity}
                  disabled={!currGood}
                  className={`w-full p-2 border rounded focus:outline-none ${
                    !currGood && "bg-gray-200"
                  } focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white`}
                  placeholder={`${
                    currGood
                      ? `Quantity (max ${currGood.maxQuantity}) / Weight`
                      : "Select a product first"
                  }`}
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
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mt-2 flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={currGood.imageUrl}
                      alt={currGood.name}
                      className="w-20 h-20 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-1">
                        Selected Product:
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200">
                        {currGood.name}
                      </p>
                      <div className="flex justify-between text-sm mt-1 flex-col sm:flex-row">
                        <span>Price: ₹{currGood.price}</span>
                        <span>Stock: {currGood.maxQuantity}</span>
                      </div>
                      <button
                        className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white font-semibold rounded-md p-2 w-full transition duration-200 mt-2"
                        onClick={() => {
                          setCurrGood(null);
                          setNewProductId("");
                          productIdRef.current?.focus();
                        }}
                      >
                        Cancel Selection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Current Bill Display */}
            <div className="w-full rounded-2xl shadow-md dark:bg-gray-800 p-4 space-y-4">
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
