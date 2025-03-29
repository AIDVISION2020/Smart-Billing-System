import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetUsersFromBranchId = () => {
  const [loading, setLoading] = useState(false);

  const getUsers = useCallback(async ({ branchIds }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.GETUSERSBYBRANCHID, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchIds,
        }),
      });

      const data = await res.json();
      if (data.error && res.status !== 404) {
        throw new Error(data.error);
      }
      setLoading(false);

      return data.users || [];
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      return [];
    }
  }, []);

  return { loading, getUsers };
};
export default useGetUsersFromBranchId;
