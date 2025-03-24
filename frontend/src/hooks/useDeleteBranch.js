import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useDeleteBranch = () => {
  const [loading, setLoading] = useState(false);

  const deleteBranch = useCallback(async ({ branchId }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.DELETEBRANCH, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
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

  return { loading, deleteBranch };
};
export default useDeleteBranch;
