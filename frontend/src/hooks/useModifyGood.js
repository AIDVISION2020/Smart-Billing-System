import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useModifyGood = () => {
  const [loading, setLoading] = useState(false);

  const modifyGood = useCallback(async ({ good, branchId }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.MODIFYGOOD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          good,
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

  return { loading, modifyGood };
};
export default useModifyGood;
