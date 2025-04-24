import PropTypes from "prop-types";
import StatCard from "../StatCard";
import PieChatCard from "../PieChartCard";
import CategoryStats from "./CategoryStats";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const METRICS = [
  { value: "totalSales", label: "Total Sales", isCurrency: true },
  { value: "totalItemsSold", label: "Items Sold" },
  { value: "totalBills", label: "Total Bills" },
  { value: "totalTax", label: "Total Tax", isCurrency: true },
];

const formatValue = (value, isCurrency) => {
  if (value == null) return "-";
  return isCurrency ? `₹${Number(value).toFixed(2)}` : value;
};

const BranchStats = ({
  branchData,
  selectedCategory,
  setSelectedCategory,
  selectedItem,
  setSelectedItem,
}) => {
  const allCategories = branchData.categoriesData || [];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl p-4 w-full">
      <div className="bg-green-600 text-white shadow-md rounded-2xl px-4 py-2 sm:py-4 sm:px-6 mb-6 w-fit">
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Branch</h2>
        <p className="text-lg sm:text-xl font-semibold">
          {branchData.location}{" "}
          <span className="text-sm">({branchData.branchId})</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-4 mb-6 justify-evenly items-center">
        {METRICS.map(({ value, label, isCurrency }) => (
          <StatCard
            key={value}
            title={label}
            value={formatValue(branchData[value], isCurrency)}
          />
        ))}
      </div>

      {/* Category Contribution Chart */}
      {branchData.categoriesData && branchData.categoriesData.length > 0 ? (
        <PieChatCard
          data={branchData.categoriesData}
          metricOptions={METRICS}
          title={"Category Contribution"}
          nameKey="categoryName"
        />
      ) : (
        <p className="text-sm text-gray-500 italic">
          No category data available.
        </p>
      )}

      <div className="w-full flex flex-col items-center justify-center rounded-lg my-6 py-6 sm:px-4">
        {/* Category Dropdown */}
        <div className="flex items-center gap-2 w-full justify-center bg-gray-300 py-2 px-4 rounded-2xl">
          <label
            htmlFor="categoryId"
            className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap"
          >
            Category
          </label>
          <div className="relative w-full sm:w-[200px]">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-2 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            >
              <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                {selectedCategory?.categoryName ?? "Select"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <ul className="absolute w-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-auto max-h-36 custom-scrollbar dark-scroll divide-y divide-gray-200 dark:divide-gray-700">
                {allCategories.map((category) => (
                  <li
                    key={category.categoryId}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedItem(null);
                      setIsOpen(false);
                    }}
                    className="cursor-pointer px-4 py-2 transition-all hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
                  >
                    <span className="font-medium">{category.categoryName}</span>{" "}
                    - <span className="text-sm">{category.categoryId}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selectedCategory && (
          <CategoryStats
            categoryData={allCategories.find(
              (category) => category.categoryId === selectedCategory?.categoryId
            )}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        )}
      </div>
    </div>
  );
};

BranchStats.propTypes = {
  branchData: PropTypes.object.isRequired,
  selectedCategory: PropTypes.object,
  setSelectedCategory: PropTypes.func.isRequired,
  selectedItem: PropTypes.object,
  setSelectedItem: PropTypes.func.isRequired,
};

export default BranchStats;
