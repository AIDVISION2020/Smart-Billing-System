import propTypes from "prop-types";
import CategoryAccordion from "../accordion/CategoryAccordion";
import GoodsTable from "../table/GoodsTable";
import { useState, useEffect } from "react";
import useGetGoodsByCategoryNames from "../../hooks/useGetGoodsByCategoryNames";
import Spinner from "../spinner/Spinner";

const IndividualBranchCategory = ({
  selectedCategory,
  setSelectedCategory,
  category,
  branchId,
  setDeleteCategoriesSelection,
  showCheckbox,
  setCategoryListChangedCnt,
  showEditGoodOption,
}) => {
  const [goods, setGoods] = useState([]);
  const { loading, getGoods } = useGetGoodsByCategoryNames();
  const [goodListChangedCnt, setGoodListChangedCnt] = useState(0);

  useEffect(() => {
    if (selectedCategory?.categoryId === category.categoryId) {
      const fetchGoods = async () => {
        const fetchedGoods = await getGoods({
          selectedCategories: [category],
          branchId,
        });
        setGoods(fetchedGoods[category.categoryId] || []);
      };

      fetchGoods();
    } else setGoods([]);
  }, [category, getGoods, branchId, goodListChangedCnt, selectedCategory]);

  const included = selectedCategory?.categoryId === category.categoryId;

  return (
    <div key={category.categoryId}>
      <CategoryAccordion
        included={included}
        changeSelection={() =>
          setSelectedCategory((prev) =>
            prev?.categoryId === category.categoryId ? null : category
          )
        }
        category={category}
        setDeleteCategoriesSelection={setDeleteCategoriesSelection}
        showCheckbox={showCheckbox}
      />
      {included && (
        <div className="mt-4 mb-8">
          {loading ? (
            <Spinner
              loadingMessage={"Fetching Goods..."}
              loadingMessageStyles={"!text-black !animate-none"}
              dotStyles={"!animate-none"}
            />
          ) : !goods.length ? (
            <div className="w-full flex justify-center mt-10">
              <div className="w-100 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-l-4 border-red-600 dark:border-red-400 px-6 py-4 rounded-lg shadow-lg max-w-lg text-center animate-fadeIn">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  No Goods Available
                </h2>
                <p className="text-lg sm:text-xl mt-2">
                  This Category doesn’t have any{" "}
                  <span className="font-semibold">goods</span> yet.
                </p>
              </div>
            </div>
          ) : (
            <GoodsTable
              goods={goods}
              showEditGoodOption={showEditGoodOption}
              setGoodListChangedCnt={setGoodListChangedCnt}
              branchId={branchId}
              setCategoryListChangedCnt={setCategoryListChangedCnt}
              categoryName={category.name}
            />
          )}
        </div>
      )}
    </div>
  );
};

IndividualBranchCategory.propTypes = {
  showCheckbox: propTypes.bool,
  category: propTypes.object.isRequired,
  branchId: propTypes.string.isRequired,
  setDeleteCategoriesSelection: propTypes.func.isRequired,
  showEditGoodOption: propTypes.bool,
  setEditingGood: propTypes.func,
  setCategoryListChangedCnt: propTypes.func,
  selectedCategory: propTypes.string,
  setSelectedCategory: propTypes.func.isRequired,
};

export default IndividualBranchCategory;
