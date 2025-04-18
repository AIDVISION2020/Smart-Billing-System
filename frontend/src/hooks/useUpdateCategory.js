import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);

  const updateCategory = useCallback(async ({ category }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.MODIFYCATEGORY, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
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

  return { loading, updateCategory };
};
export default useUpdateCategory;
