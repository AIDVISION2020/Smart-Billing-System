import PropTypes from "prop-types";
import useGetCategoriesFromBranchId from "@/hooks/useGetCategoriesFromBranchId";
import { useState, useEffect } from "react";
import BranchCategories from "../branchCategories/BranchCategories";
import Spinner from "../spinner/Spinner";

const SelectedBranch = ({ selectedBranch }) => {
  const { loading, getCategories } = useGetCategoriesFromBranchId();
  const [categories, setCategories] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [categoryListChangedCnt, setCategoryListChangedCnt] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetched(false);
      setCategories([]);
      const fetchedCategories = await getCategories(selectedBranch);

      setCategories(fetchedCategories);
      setIsFetched(true);
    };
    if (selectedBranch) fetchCategories();
  }, [selectedBranch, getCategories, categoryListChangedCnt]);

  return (
    <div className="h-screen w-full">
      {loading ? (
        <Spinner
          loadingMessageStyles={"text-4xl"}
          loadingMessage={"Fetching categories..."}
        />
      ) : (
        isFetched && (
          <div
            className={`flex flex-col gap-4 max-h-full p-2 px-8 my-16 ${
              !categories.length && "justify-center items-center"
            }`}
          >
            <BranchCategories
              categories={categories}
              branchId={selectedBranch}
              setCategoryListChangedCnt={setCategoryListChangedCnt}
            />
          </div>
        )
      )}
    </div>
  );
};

SelectedBranch.propTypes = {
  selectedBranch: PropTypes.string.isRequired,
};

export default SelectedBranch;
