import propTypes from "prop-types";
import ManualCategorySelection from "./ManualCategorySelection";
import ManualGoodSelection from "./ManualGoodSelection";
import { useEffect } from "react";

const ManualItemAddition = ({
  setCurrGood,
  setImage,
  branchId,
  currCategory,
  setCurrCategory,
}) => {
  useEffect(() => {
    if (currCategory?.imageUrl) {
      setImage(currCategory.imageUrl);
    } else {
      setImage(null);
    }
  }, [currCategory, setImage]);

  return (
    <div className="w-full mx-auto px-2 sm:px-4">
      {!currCategory ? (
        <ManualCategorySelection
          setCurrCategory={setCurrCategory}
          branchId={branchId}
          currCategory={currCategory}
        />
      ) : (
        <ManualGoodSelection
          setCurrGood={setCurrGood}
          branchId={branchId}
          currCategory={currCategory}
          setCurrCategory={setCurrCategory}
        />
      )}
    </div>
  );
};

ManualItemAddition.propTypes = {
  setCurrGood: propTypes.func.isRequired,
  setImage: propTypes.func.isRequired,
  branchId: propTypes.string.isRequired,
  currCategory: propTypes.string.isRequired,
  setCurrCategory: propTypes.func.isRequired,
};

export default ManualItemAddition;
