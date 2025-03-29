import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const updateUser = useCallback(async ({ user }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.UPDATEUSER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updatedUser: user,
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

  return { loading, updateUser };
};
export default useUpdateUser;
