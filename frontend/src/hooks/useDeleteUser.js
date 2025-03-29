import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const deleteUser = useCallback(async ({ userId }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.DELETEUSERBYID, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
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

  return { loading, deleteUser };
};
export default useDeleteUser;
