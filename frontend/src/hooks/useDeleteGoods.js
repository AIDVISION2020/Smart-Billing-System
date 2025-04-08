import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useDeleteGoods = () => {
  const [loading, setLoading] = useState(false);

  const deleteGoods = useCallback(async ({ branchId, itemIds }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.DELETEGOODS, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          itemIds,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, deleteGoods };
};
export default useDeleteGoods;
