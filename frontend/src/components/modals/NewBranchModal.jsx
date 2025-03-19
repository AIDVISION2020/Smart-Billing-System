import { useState } from "react";
import useAddNewBranch from "../../hooks/useAddNewBranch";
import Spinner from "@/components/spinner/Spinner";
import { X as Close, Plus } from "lucide-react";

// eslint-disable-next-line react/prop-types
const NewBranchModal = ({ showModal, setShowModal }) => {
  const [newBranch, setNewBranch] = useState({
    branchId: "",
    location: "",
  });

  const { loading, addNewBranch } = useAddNewBranch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBranch({
      ...newBranch,
      [name]:
        name === "location"
          ? value.trimStart().toUpperCase()
          : value.trimStart(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewBranch({
      branchId: newBranch.branchId.trim(),
      location: newBranch.location.trim(),
    });
    await addNewBranch(newBranch);
    setShowModal(false);
    setNewBranch({ branchId: "", location: "" });
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
      <div className="p-4 w-full max-w-md">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform transition-all duration-300 ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              New Branch
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white p-2 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              <Close className="w-6 h-6" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal Body */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* Branch ID Input */}
            <div>
              <label
                htmlFor="branchId"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Branch ID
              </label>
              <input
                type="text"
                name="branchId"
                id="branchId"
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                placeholder="Enter Branch ID"
                required
                minLength={1}
                maxLength={20}
                value={newBranch.branchId}
                onChange={handleChange}
              />
            </div>

            {/* Location Input */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Location
              </label>
              <textarea
                name="location"
                id="location"
                rows="4"
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                placeholder="Enter Branch Location"
                required
                minLength={3}
                maxLength={50}
                value={newBranch.location}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-5 py-3 text-white bg-blue-600 rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
            >
              {loading ? (
                <Spinner dotStyles="bg-white h-3 w-3" />
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Branch
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewBranchModal;
