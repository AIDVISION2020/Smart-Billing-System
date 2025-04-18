import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetGoodsByQuery = () => {
  const [loading, setLoading] = useState(false);

  const getGoods = useCallback(async ({ branchId, categoryId, query }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.GETGOODSBYQUERY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          categoryId,
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

  return { loading, getGoods };
};
export default useGetGoodsByQuery;
