import { Search, ArrowLeft } from "lucide-react";
import propTypes from "prop-types";
import { useState, useEffect } from "react";
import useGetGoodsByQuery from "../../hooks/useGetGoodsByQuery";

const ManualGoodSelection = ({
  branchId,
  currCategory,
  setCurrGood,
  setCurrCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [initReqMade, setInitReqMade] = useState(false);

  const { getGoods } = useGetGoodsByQuery();

  useEffect(() => {
    const getFilteredCategories = setTimeout(async () => {
      try {
        setFilteredResults(
          await getGoods({
            branchId,
            categoryId: currCategory.categoryId,
            query: searchQuery,
          })
        );
        if (!initReqMade) {
          setInitReqMade(true);
        }
      } catch (error) {
        console.error("Error fetching goods:", error);
      }
    }, 500);

    return () => {
      clearTimeout(getFilteredCategories);
    };
  }, [searchQuery, branchId, getGoods, currCategory, initReqMade]);

  return (
    <div className="w-full mx-auto sm:px-2">
      <div
        className="flex items-center gap-2 px-4 py-2 mb-4 bg-blue-500 dark:bg-blue-600 rounded-xl shadow-md w-fit cursor-pointer"
        onClick={() => setCurrCategory(null)}
      >
        <ArrowLeft className="h-5 w-5 text-white" />
        <button className="text-sm font-medium text-white rounded transition">
          Change category
        </button>
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
        </span>
        <input
          type="text"
          placeholder="Enter itemId or item name..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
      {!initReqMade ? (
        <div className="mt-8 text-center text-black dark:text-white animate-bounce ">
          <span>Loading items ...</span>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3 w-full max-h-[400px] overflow-y-auto">
          {filteredResults.map((good) => (
            <div
              key={good.itemId}
              onClick={() =>
                setCurrGood({
                  ...good,
                  quantity: 1,
                  maxQuantity: good.quantity,
                })
              }
              className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex justify-between items-center gap-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full justify-between">
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 font-semibold">
                  {good.itemId}
                </span>
                <div className="text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400 break-words">
                  {good.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-300">
          <span>No Goods found</span>
        </div>
      )}
    </div>
  );
};

ManualGoodSelection.propTypes = {
  setCurrGood: propTypes.func.isRequired,
  branchId: propTypes.string.isRequired,
  currCategory: propTypes.object.isRequired,
  setCurrCategory: propTypes.func.isRequired,
};

export default ManualGoodSelection;
