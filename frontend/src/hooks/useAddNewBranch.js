import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useAddNewBranch = () => {
  const [loading, setLoading] = useState(false);

  const addNewBranch = useCallback(async ({ location, branchId }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.ADDNEWBRANCH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
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
  }, []);

  return { loading, addNewBranch };
};
export default useAddNewBranch;
