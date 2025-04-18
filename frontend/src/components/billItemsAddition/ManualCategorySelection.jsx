import { Search } from "lucide-react";
import propTypes from "prop-types";
import { useState, useEffect } from "react";
import useGetCategoriesByQuery from "../../hooks/useGetCategoriesByQuery";

const ManualCategorySelection = ({ setCurrCategory, branchId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [initReqMade, setInitReqMade] = useState(false);

  const { getCategories } = useGetCategoriesByQuery();

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const results = await getCategories({ branchId, query: searchQuery });
        setFilteredResults(results);
        if (!initReqMade) setInitReqMade(true);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, branchId, getCategories, initReqMade]);

  return (
    <div className="w-full mx-auto sm:px-2">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
        </span>
        <input
          type="text"
          placeholder="Enter categoryId or category name..."
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
        <div className="mt-8 text-center text-black dark:text-white animate-bounce">
          <span>Loading categories...</span>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-h-[400px] overflow-y-auto p-2">
          {filteredResults.map((category) => (
            <div
              key={category.categoryId}
              onClick={() => setCurrCategory(category)}
              className="flex items-center p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-16 h-16 object-contain rounded-lg mr-4"
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {category.categoryId}
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {category.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-300 flex flex-col items-center justify-center">
          <span>No categories found</span>
          <span className="text-gray-400 dark:text-gray-500">
            Try a different search term.
          </span>
        </div>
      )}
    </div>
  );
};

ManualCategorySelection.propTypes = {
  setCurrCategory: propTypes.func.isRequired,
  branchId: propTypes.string.isRequired,
};

export default ManualCategorySelection;
