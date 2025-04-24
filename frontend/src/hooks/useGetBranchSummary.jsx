import { APIEndpoints } from "@/constants/constants";
import { useAuthContext } from "@/context/authContext";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetBranchSummary = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();
  const branchId = authUser?.branchId || null;

  const getBranchSummary = useCallback(
    async ({ startDate, endDate }) => {
      setLoading(true);

      try {
        const res = await fetch(APIEndpoints.GETBRANCHSUMMARY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branchId,
            startDate,
            endDate,
          }),
        });

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }
        return data.data;
      } catch (error) {
        toast.error(error.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [branchId]
  );

  return { loading, getBranchSummary };
};
export default useGetBranchSummary;
