import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetStockSummary = () => {
  const [loading, setLoading] = useState(false);

  const getStockSummary = useCallback(
    async ({ branchId, startDate, endDate }) => {
      setLoading(true);

      try {
        const res = await fetch(APIEndpoints.GETSTOCKSUMMARY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branchId,
            startDate,
            endDate,
          }),
        });

        const data = await res.json();
        if (data.error && res.status !== 404) {
          throw new Error(data.error);
        }
        setLoading(false);
        return { items: data.items, categories: data.categories };
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
        return { items: null, categories: null };
      }
    },
    []
  );

  return { loading, getStockSummary };
};

export default useGetStockSummary;
