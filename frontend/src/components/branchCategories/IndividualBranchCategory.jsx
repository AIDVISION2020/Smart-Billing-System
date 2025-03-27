import propTypes from "prop-types";
import CategoryAccordion from "../accordion/CategoryAccordion";
import GoodsTable from "../table/GoodsTable";
import { useState, useEffect } from "react";
import useGetGoodsByCategoryNames from "../../hooks/useGetGoodsByCategoryNames";
import Spinner from "../spinner/Spinner";

const IndividualBranchCategory = ({
  category,
  branchId,
  setDeleteCategoriesSelection,
  showCheckbox,
  showEditGoodOption,
}) => {
  const [included, setIncluded] = useState(false);
  const [goods, setGoods] = useState([]);
  const { loading, getGoods } = useGetGoodsByCategoryNames();
  const [goodListChangedCnt, setGoodListChangedCnt] = useState(0);

  useEffect(() => {
    if (included) {
      const fetchGoods = async () => {
        const fetchedGoods = await getGoods({
          selectedCategories: [category],
          branchId,
        });

        setGoods(fetchedGoods[category.categoryId]);
      };

      fetchGoods();
    } else setGoods([]);
  }, [included, category, getGoods, branchId, goodListChangedCnt]);

  return (
    <div key={category.categoryId}>
      <CategoryAccordion
        included={included}
        setIncluded={() => setIncluded(!included)}
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
          ) : (
            <GoodsTable
              goods={goods}
              showEditGoodOption={showEditGoodOption}
              setGoodListChangedCnt={setGoodListChangedCnt}
              branchId={branchId}
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
};

export default IndividualBranchCategory;
