import { useCallback, useEffect, useState } from "react";
import useGetStockSummary from "../../../hooks/useGetStockSummary";
import toast from "react-hot-toast";
import Spinner from "../../Spinner/Spinner";
import { ChevronDown } from "lucide-react";
import useGetAccessibleBranches from "../../../hooks/useGetAccessibleBranches";
import PieChatCard from "../PieChartCard";

const StockInsights = () => {
  const { getStockSummary } = useGetStockSummary();
  const { getAccessibleBranches } = useGetAccessibleBranches();

  const [allBranches, setAllBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasFetchedInitially, setHasFetchedInitially] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockSummary, setStockSummary] = useState({
    items: null,
    categories: null,
  });

  const fetchStockSummary = useCallback(async () => {
    if (!selectedBranch) return;
    setLoading(true);
    try {
      const { items, categories } = await getStockSummary({
        branchId: selectedBranch.branchId,
      });

      setStockSummary({ items, categories });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [getStockSummary, selectedBranch]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branches = await getAccessibleBranches();
        setAllBranches(branches);
        if (branches.length === 1) {
          setSelectedBranch(branches[0]);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchBranches();
  }, [getAccessibleBranches]);

  useEffect(() => {
    if (!hasFetchedInitially && selectedBranch) {
      fetchStockSummary();
      setHasFetchedInitially(true);
    }
  }, [hasFetchedInitially, fetchStockSummary, selectedBranch]);

  const lowStockItems = stockSummary.items?.filter(
    (item) => item.label === "low-stock"
  );

  return (
    <div className="px-1 py-4 sm:p-4 w-full">
      {loading ? (
        <Spinner
          loadingMessageStyles="text-4xl font-semibold"
          loadingMessage="Generating stock summary..."
        />
      ) : (
        <div className="flex flex-col items-center justify-center ">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800">
            Stock Overview
          </h2>

          <div className="w-full flex flex-col items-center justify-center rounded-lg mb-6 py-2 sm:px-4">
            <div className="flex items-center w-full sm:w-[250px] gap-2 justify-center bg-gray-300 py-2 px-4 rounded-2xl">
              <label
                htmlFor="branchID"
                className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap"
              >
                Branch ID
              </label>
              {allBranches.length > 1 ? (
                <div className="relative w-full sm:w-[200px]">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-2 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                  >
                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                      {selectedBranch?.branchId ?? "Select"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <ul className="absolute w-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-auto max-h-36 custom-scrollbar dark-scroll divide-y divide-gray-200 dark:divide-gray-700">
                      {allBranches.map((branch) => (
                        <li
                          key={branch.branchId}
                          onClick={() => {
                            setSelectedBranch(branch);
                            setIsOpen(false);
                            setHasFetchedInitially(false);
                          }}
                          className="cursor-pointer px-4 py-2 transition-all hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
                        >
                          <span className="font-medium">{branch.branchId}</span>{" "}
                          - {branch.location}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div>
                  <span className="font-medium">
                    {allBranches[0]?.branchId}
                  </span>{" "}
                  - {allBranches[0]?.location}
                </div>
              )}
            </div>
          </div>

          {stockSummary.items && stockSummary.categories && (
            <div className="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <PieChatCard
                title="Stock by Categories"
                nameKey="categoryName"
                data={stockSummary.categories}
                metricOptions={[
                  {
                    label: "Total Stock",
                    value: "totalStock",
                    isCurrency: false,
                  },
                  {
                    label: "Unique Item Count",
                    value: "uniqueItemCount",
                    isCurrency: false,
                  },
                  {
                    label: "Low Stock Items",
                    value: "lowStockCount",
                    isCurrency: false,
                  },
                  {
                    label: "Stock Value",
                    value: "stockValue",
                    isCurrency: true,
                  },
                ]}
              />

              <PieChatCard
                title="Stock by Items"
                nameKey="name"
                data={stockSummary.items}
                metricOptions={[
                  { label: "Quantity", value: "stock", isCurrency: false },
                  {
                    label: "Stock Value",
                    value: "stockValue",
                    isCurrency: true,
                  },
                ]}
              />

              {lowStockItems?.length > 0 && (
                <div className="bg-white shadow-md rounded-2xl p-6 max-w-5xl w-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Low Stock Items
                  </h3>
                  {Object.entries(
                    lowStockItems.reduce((acc, item) => {
                      const category = item.categoryName || "Uncategorized";
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(item);
                      return acc;
                    }, {})
                  ).map(([categoryName, items]) => (
                    <div key={categoryName} className="mb-6">
                      <h4 className="text-lg font-semibold text-blue-700 mb-2">
                        {categoryName}
                      </h4>
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {items.map((item) => (
                            <li
                              key={item.itemId}
                              className="flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Item ID: {item.itemId}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-red-600">
                                {item.stock} left
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockInsights;
