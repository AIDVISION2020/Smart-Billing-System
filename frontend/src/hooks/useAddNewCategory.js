import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useAddNewCategory = () => {
  const [loading, setLoading] = useState(false);

  const addCategory = useCallback(
    async ({ categoryName: category, branchId }) => {
      setLoading(true);
      try {
        const res = await fetch(APIEndpoints.ADDCATEGORY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branchId,
            category,
          }),
        });

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        } else {
          toast.success(data.message);
          return true;
        }
      } catch (error) {
        toast.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, addCategory };
};
export default useAddNewCategory;
