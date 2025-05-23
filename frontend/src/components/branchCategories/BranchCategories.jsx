import propTypes from "prop-types";
import IndividualBranchCategory from "./IndividualBranchCategory";
import { useEffect, useState } from "react";
import ConfirmModal from "../modals/confirmModal";
import { Trash2, Plus, Search } from "lucide-react";
import NewGood from "./NewGood";
import useDeleteCategoriesByCategoryIds from "../../hooks/useDeleteCategoriesByCategoryIds";
import useAddNewGoods from "../../hooks/useAddNewGoods";
import NewCategory from "./NewCategory";

const BranchCategories = ({
  categories,
  branchId,
  setCategoryListChangedCnt,
}) => {
  //Deletion of categories
  const [deleteCategoriesSelection, setDeleteCategoriesSelection] = useState(
    []
  );
  const [deleteResponse, setDeleteResponse] = useState(false);
  const { deleteCategories } = useDeleteCategoriesByCategoryIds();
  const joinCategoryNames = () => {
    return deleteCategoriesSelection
      .map((category) => category.name)
      .join(", ");
  };
  useEffect(() => {
    const deleteCategoryIds = async () => {
      const categoryIds = deleteCategoriesSelection.map(
        (category) => category.categoryId
      );
      await deleteCategories({ categoryIds, branchId });
      setCategoryListChangedCnt((prev) => prev + 1);
      setDeleteCategoriesSelection([]);
      setDeleteResponse(false);
    };
    if (deleteResponse) deleteCategoryIds();
  }, [
    deleteResponse,
    deleteCategoriesSelection,
    branchId,
    setCategoryListChangedCnt,
    deleteCategories,
  ]);

  const confirmMessage_Delete = (
    <div>
      <span>
        Are you sure you want to delete the following{" "}
        <span className="text-red-600 underline">categories</span> and the
        products in them ?
      </span>
      <div className="text-red-600 dark:text-red-400 font-semibold">
        {" "}
        {joinCategoryNames()}{" "}
      </div>
      <span>This action cannot be undone</span>
    </div>
  );

  const yesMessage_Delete = "Delete";
  const noMessage = "Cancel";
  const toggalModalMessage_Delete = (
    <>
      <div
        className="fixed bottom-6 right-6 px-6 py-2 flex items-center gap-2 border-2 border-red-600 bg-red-100 text-red-600 rounded-lg shadow-md cursor-pointer 
  hover:bg-red-600 hover:text-white hover:shadow-lg active:scale-95 transition-all duration-300"
      >
        <span className="font-semibold text-lg">
          Delete {deleteCategoriesSelection.length}
        </span>
        <Trash2 size={22} strokeWidth={2.5} />
      </div>
    </>
  );

  // Addition of goods
  const [newGoods, setNewGoods] = useState([]);
  const { addGoods } = useAddNewGoods();

  const [addResponse, setAddResponse] = useState(false);

  useEffect(() => {
    const addNewGoods = async () => {
      await addGoods({ goods: newGoods, branchId });
      setNewGoods([]);
      setAddResponse(false);
      setCategoryListChangedCnt((prev) => prev + 1);
    };
    if (addResponse) addNewGoods();
  }, [addResponse, newGoods, branchId, addGoods, setCategoryListChangedCnt]);

  const confirmMessage_Add = (
    <div>
      <span>
        Are you sure you want to add these{" "}
        <span className="text-green-600">{newGoods.length}</span> items?
      </span>
    </div>
  );

  const yesMessage_Add = "Add";
  const toggalModalMessage_Add = (
    <>
      <div
        className="fixed bottom-6 right-6 px-6 py-2 flex items-center gap-2 border-2 border-green-600 bg-green-100 text-green-600 rounded-lg shadow-md cursor-pointer 
  hover:bg-green-600 hover:text-white hover:shadow-lg active:scale-95 transition-all duration-300"
      >
        <span className="font-semibold text-lg">Add {newGoods.length}</span>
        <Plus size={22} strokeWidth={2.5} />
      </div>
    </>
  );

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");

  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    const filteredResult = categories.filter((category) => {
      const { categoryId, name } = category;
      return (
        categoryId.toLowerCase().includes(filterQuery.toLowerCase()) ||
        name.toLowerCase().includes(filterQuery.toLowerCase())
      );
    });
    setFilteredCategories(filteredResult);
    // setCategories(filteredCategories);
  }, [filterQuery, categories]);

  return (
    <>
      {!categories.length ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-l-4 border-red-600 dark:border-red-400 px-6 py-4 rounded-lg shadow-lg max-w-lg text-center animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl font-bold">
            No Categories Available
          </h2>
          <p className="text-lg sm:text-xl mt-2">
            This branch doesn’t have any{" "}
            <span className="font-semibold">categories</span> yet.
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            </span>
            <input
              type="text"
              placeholder="Enter categoryId or category name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          {filteredCategories.map((category) => {
            return (
              <IndividualBranchCategory
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                category={category}
                branchId={branchId}
                key={category.categoryId}
                setCategoryListChangedCnt={setCategoryListChangedCnt}
                setDeleteCategoriesSelection={setDeleteCategoriesSelection}
                showCheckbox={newGoods.length === 0}
                showEditGoodOption={
                  newGoods.length === 0 &&
                  deleteCategoriesSelection.length === 0
                }
              />
            );
          })}
        </>
      )}
      {deleteCategoriesSelection.length > 0 ? (
        <ConfirmModal
          confirmMessage={confirmMessage_Delete}
          yesMessage={yesMessage_Delete}
          noMessage={noMessage}
          toggalModalMessage={toggalModalMessage_Delete}
          setResponse={setDeleteResponse}
        />
      ) : selectedCategory ? (
        <>
          <NewGood
            selectedCategory={selectedCategory}
            setNewGoods={setNewGoods}
            newGoods={newGoods}
          />
          {newGoods.length > 0 && (
            <ConfirmModal
              confirmMessage={confirmMessage_Add}
              yesMessage={yesMessage_Add}
              noMessage={noMessage}
              toggalModalMessage={toggalModalMessage_Add}
              setResponse={setAddResponse}
            />
          )}
        </>
      ) : (
        <NewCategory
          branchId={branchId}
          setCategoryListChangedCnt={setCategoryListChangedCnt}
        />
      )}
    </>
  );
};

BranchCategories.propTypes = {
  categories: propTypes.array.isRequired,
  branchId: propTypes.string.isRequired,
  setCategoryListChangedCnt: propTypes.func.isRequired,
};

export default BranchCategories;
