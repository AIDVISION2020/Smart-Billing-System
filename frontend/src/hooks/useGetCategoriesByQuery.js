import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetCategoriesByQuery = () => {
  const [loading, setLoading] = useState(false);

  const getCategories = useCallback(async ({ branchId, query }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.GETCATEGORIESBYQUERY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          query,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setLoading(false);
      return data.searchResults;
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      return [];
    }
  }, []);

  return { loading, getCategories };
};
export default useGetCategoriesByQuery;
