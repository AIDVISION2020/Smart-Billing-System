import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useAddNewGoods = () => {
  const [loading, setLoading] = useState(false);

  const addGoods = useCallback(async ({ goods, branchId }) => {
    setLoading(true);
    try {
      const res = await fetch(APIEndpoints.ADDGOODS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          goods,
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

  return { loading, addGoods };
};
export default useAddNewGoods;
