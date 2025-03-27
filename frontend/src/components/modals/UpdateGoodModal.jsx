import { useState, useEffect } from "react";
import useModifyGood from "@/hooks/useModifyGood";
import Spinner from "@/components/spinner/Spinner";
import { X as Close, Save, Replace } from "lucide-react";
import propTypes from "prop-types";

const UpdateGoodModal = ({
  showModal,
  setShowModal,
  setGoodListChangedCnt,
  branchId,
  currGood,
  categoryName,
}) => {
  const [updatedGood, setUpdatedGood] = useState({
    name: currGood.name || "",
    description: currGood.description || "",
    price: currGood.price || 0,
    quantity: currGood.quantity || 1,
    tax: currGood.tax || 0,
    itemId: currGood.itemId,
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const { loading, modifyGood } = useModifyGood();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedGood((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  useEffect(() => {
    setIsDisabled(() => {
      for (const key in updatedGood) {
        const updatedValue = updatedGood[key];
        const currentValue = currGood[key];

        // Convert to numbers only if they are numeric
        const isNumeric = !isNaN(updatedValue) && !isNaN(currentValue);
        if (isNumeric && Number(updatedValue) !== Number(currentValue))
          return false;

        if (!isNumeric && updatedValue !== currentValue) return false;
      }
      return true;
    });
  }, [updatedGood, currGood]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in updatedGood) {
      if (typeof updatedGood[key] === "string") {
        updatedGood[key] = updatedGood[key].trim();
      }
    }

    await modifyGood({ branchId, good: updatedGood });
    setShowModal(false);
    setGoodListChangedCnt((prev) => prev + 1);
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="p-4 w-full max-w-md max-h-[90%] overflow-y-auto custom-scrollbar dark-scroll">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform transition-all duration-300 ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Good
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white p-2 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              <Close className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="flex border-2 border-gray-300 justify-between items-center py-4 px-6 rounded-lg flex-wrap">
              <div>
                <span className="text-gray-800 dark:text-gray-400 font-bold">
                  BranchId :{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-400 font-semibold">
                  {branchId}
                </span>
              </div>
              <div>
                <span className="text-gray-800 dark:text-gray-400 font-bold">
                  Category :{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-400 font-semibold">
                  {categoryName}
                </span>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({ ...updatedGood, name: currGood.name })
                  }
                />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                minLength={3}
                maxLength={50}
                value={updatedGood.name}
                onChange={handleChange}
              />
            </div>

            {/* Description Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({
                      ...updatedGood,
                      description: currGood.description,
                    })
                  }
                />
              </div>
              <textarea
                name="description"
                id="description"
                className="text-md w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-none h-24 custom-scrollbar dark-scroll"
                placeholder="Enter description..."
                required
                minLength={3}
                maxLength={50}
                value={updatedGood.description}
                onChange={handleChange}
              />
            </div>

            {/* Price Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({ ...updatedGood, price: currGood.price })
                  }
                />
              </div>
              <input
                type="number"
                name="price"
                id="price"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min={0}
                step="0.01"
                value={updatedGood.price}
                onChange={handleChange}
              />
            </div>

            {/* Quantity Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Quantity
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({
                      ...updatedGood,
                      quantity: currGood.quantity,
                    })
                  }
                />
              </div>
              <input
                type="number"
                name="quantity"
                id="quantity"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min={1}
                max={999999999}
                value={updatedGood.quantity}
                onChange={handleChange}
              />
            </div>

            {/* Tax Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="tax"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tax (%)
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({ ...updatedGood, tax: currGood.tax })
                  }
                />
              </div>
              <input
                type="number"
                name="tax"
                id="tax"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min={0}
                max={100}
                step={0.01}
                value={updatedGood.tax}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={isDisabled}
              type="submit"
              className={`w-full flex items-center justify-center px-5 py-3 rounded-lg shadow-lg transition-all duration-300 
                ${
                  isDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
                }
              `}
            >
              {loading ? (
                <Spinner dotStyles="bg-white h-3 w-3" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Good
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

UpdateGoodModal.propTypes = {
  showModal: propTypes.bool.isRequired,
  setShowModal: propTypes.func.isRequired,
  setGoodListChangedCnt: propTypes.func.isRequired,
  branchId: propTypes.string.isRequired,
  currGood: propTypes.object.isRequired,
  categoryName: propTypes.string.isRequired,
};

export default UpdateGoodModal;
