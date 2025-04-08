import propTypes from "prop-types";
import { useState } from "react";
import { Plus, Send } from "lucide-react";
import useAddNewCategory from "../../hooks/useAddNewCategory";
import Spinner from "../spinner/Spinner";

import toast from "react-hot-toast";

const NewCategory = ({ branchId, setCategoryListChangedCnt }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");

  const { loading, addCategory } = useAddNewCategory();

  const handleSubmit = () => {
    if (inputText.trim() === "") {
      toast.error("Category name cannot be empty!");
      return;
    }
    const addNewCategory = async () => {
      const categoryCreated = await addCategory({
        categoryName: inputText,
        branchId,
      });
      if (!categoryCreated) return;
      setCategoryListChangedCnt((prev) => prev + 1);
      setInputText("");
      setShowInput(false);
    };
    addNewCategory();
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-8">
      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add Category
        </button>
      )}

      {showInput && (
        <div className="w-full max-w-md flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-4 py-2 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? (
              <Spinner dotStyles="bg-white h-3 w-3" />
            ) : (
              <>
                <Send size={18} />
                Submit
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

NewCategory.propTypes = {
  branchId: propTypes.string.isRequired,
  setCategoryListChangedCnt: propTypes.func.isRequired,
};

export default NewCategory;
