import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useCreateUser = () => {
  const [loading, setLoading] = useState(false);

  const createUser = useCallback(async ({ userInfo }) => {
    setLoading(true);

    try {
      const res = await fetch(APIEndpoints.CREATEUSER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInfo,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        toast.success(data.message);
      }
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      return false;
    }
  }, []);

  return { loading, createUser };
};
export default useCreateUser;
