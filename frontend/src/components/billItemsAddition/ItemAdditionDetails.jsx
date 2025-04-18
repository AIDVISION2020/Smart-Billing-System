import propTypes from "prop-types";

const ItemAdditionDetails = ({ setItemAdditionMode, itemAdditionMode }) => {
  return (
    <>
      <div className="w-full flex justify-center mb-4">
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-700 p-2 px-4 rounded-full shadow-md">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mode:
          </span>
          <button
            onClick={() => setItemAdditionMode("auto")}
            className={`px-4 py-1 rounded-full transition duration-300 text-sm font-semibold ${
              itemAdditionMode === "auto"
                ? "bg-green-500 text-white shadow"
                : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
            }`}
          >
            Automatic
          </button>
          <button
            onClick={() => setItemAdditionMode("manual")}
            className={`px-4 py-1 rounded-full transition duration-300 text-sm font-semibold ${
              itemAdditionMode === "manual"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
            }`}
          >
            Manual
          </button>
        </div>
      </div>
    </>
  );
};

ItemAdditionDetails.propTypes = {
  setItemAdditionMode: propTypes.func.isRequired,
  itemAdditionMode: propTypes.string.isRequired,
};

export default ItemAdditionDetails;
