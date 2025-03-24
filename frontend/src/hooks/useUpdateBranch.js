import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useUpdateBranch = () => {
  const [loading, setLoading] = useState(false);

  const updateBranch = useCallback(
    async ({ oldBranchId, newBranchId, location }) => {
      setLoading(true);

      try {
        const res = await fetch(APIEndpoints.UPDATEBRANCH, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldBranchId,
            newBranchId,
            location,
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
    },
    []
  );

  return { loading, updateBranch };
};
export default useUpdateBranch;
