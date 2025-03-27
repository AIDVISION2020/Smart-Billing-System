import PropTypes from "prop-types";
import { ListCollapse } from "lucide-react";
import { useState, useEffect } from "react";

const CategoryAccordion = ({
  included,
  setIncluded,
  category,
  setDeleteCategoriesSelection,
  showCheckbox,
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setDeleteCategoriesSelection((prev) => {
      if (checked) {
        return [...prev, category];
      } else {
        return prev.filter((cat) => cat.categoryId !== category.categoryId);
      }
    });
  }, [checked, category, setDeleteCategoriesSelection]);

  return (
    <>
      <div
        className={`p-4 rounded-xl shadow-xl border transition-all duration-300 
${
  included
    ? "bg-blue-500/20 border-blue-500 text-blue-500 dark:bg-blue-400/20 dark:border-blue-400"
    : "bg-gray-800/50 border-gray-700 text-white dark:bg-gray-100/50 dark:border-gray-300 dark:text-black hover:bg-gray-700/40 dark:hover:bg-gray-200/40"
}`}
        key={category.categoryId}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-grow justify-start">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIncluded(category)}
            >
              <ListCollapse
                size={24}
                className={`${
                  included ? "text-gray-400 dark:text-gray-600" : ""
                } `}
              />
              <h2 className="text-lg sm:text-xl font-medium">
                {category.name}
              </h2>
            </div>
          </div>
          <div className="flex justify-evenly items-center gap-x-4">
            <div
              className={`px-4 py-1 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 cursor-pointer
  ${
    included
      ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-black shadow-md"
      : "bg-gray-700 text-gray-300 dark:bg-gray-300 dark:text-gray-700 hover:bg-gray-600 dark:hover:bg-gray-400"
  }`}
              onClick={() => setIncluded(category)}
            >
              {included ? "Selected" : "Select"}
            </div>

            {showCheckbox && (
              <div className="flex items-center">
                <input
                  checked={checked}
                  id="checked-checkbox"
                  type="checkbox"
                  value=""
                  onChange={() => setChecked(!checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

CategoryAccordion.propTypes = {
  included: PropTypes.bool.isRequired,
  setIncluded: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
  setDeleteCategoriesSelection: PropTypes.func.isRequired,
  showCheckbox: PropTypes.bool.isRequired,
};

export default CategoryAccordion;
