import { APIEndpoints } from "@/constants/constants";
import { useState } from "react";
import toast from "react-hot-toast";

const useCreateNewBill = () => {
  const [loading, setLoading] = useState(false);

  const createBill = async ({ newBill }) => {
    setLoading(true);
    try {
      const res = await fetch(APIEndpoints.CREATENEWBILL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newBill,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      } else if (data.message) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createBill };
};
export default useCreateNewBill;
