import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useGetBillsSalesSummary = () => {
  const [loading, setLoading] = useState(false);

  const getBillsSummary = useCallback(
    async ({ branchId, startDate, endDate }) => {
      setLoading(true);

      try {
        const res = await fetch(APIEndpoints.GETBILLSSALESSUMMARY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branchId,
            startDate,
            endDate,
          }),
        });

        const data = await res.json();
        if (data.error && res.status !== 404) {
          throw new Error(data.error);
        }
        setLoading(false);

        return data.data;
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
        return [];
      }
    },
    []
  );

  return { loading, getBillsSummary };
};

export const useGetBillItemsSalesSummary = () => {
  const [loading, setLoading] = useState(false);

  const getBillItemsSummary = useCallback(
    async ({ branchId, startDate, endDate }) => {
      setLoading(true);

      try {
        const res = await fetch(APIEndpoints.GETBILLITEMSSALESSUMMARY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branchId,
            startDate,
            endDate,
          }),
        });

        const data = await res.json();
        if (data.error && res.status !== 404) {
          throw new Error(data.error);
        }
        setLoading(false);

        return data.data;
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
        return [];
      }
    },
    []
  );

  return { loading, getBillItemsSummary };
};
