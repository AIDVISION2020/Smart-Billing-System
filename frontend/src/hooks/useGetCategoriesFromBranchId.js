import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetCategoriesFromBranchId = () => {
  const [loading, setLoading] = useState(false);

  const getCategories = useCallback(async (branchId) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.GETCATEGORIESFROMBRANCHID, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setLoading(false);
      return data.allCategories;
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      return [];
    }
  }, []);

  return { loading, getCategories };
};
export default useGetCategoriesFromBranchId;
