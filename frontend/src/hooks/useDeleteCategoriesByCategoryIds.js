import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useDeleteCategoriesByCategoryIds = () => {
  const [loading, setLoading] = useState(false);

  const deleteCategories = useCallback(async ({ branchId, categoryIds }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.DELETECATEGORIES, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          categoryIds,
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

  return { loading, deleteCategories };
};
export default useDeleteCategoriesByCategoryIds;
