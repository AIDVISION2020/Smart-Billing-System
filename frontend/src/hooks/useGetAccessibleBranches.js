import { APIEndpoints } from "@/constants/constants";
import { useAuthContext } from "@/context/authContext";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetAccessibleBranches = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();
  const getAccessibleBranches = useCallback(async () => {
    let accessibleBranches = [];
    setLoading(true);
    try {
      const res = await fetch(APIEndpoints.GETACCESSIBLEBRANCHES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: authUser.role,
          branchId: authUser.branchId
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      accessibleBranches = data.accessibleBranches;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

    return accessibleBranches;
  }, [authUser.branchId, authUser.role]);

  return { loading, getAccessibleBranches };
};
export default useGetAccessibleBranches;