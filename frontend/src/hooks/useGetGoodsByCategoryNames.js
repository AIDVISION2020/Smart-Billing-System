import { APIEndpoints } from "@/constants/constants";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

const useGetGoodsByCategoryNames = () => {
  const [loading, setLoading] = useState(false);

  const getGoods = useCallback(async ({ selectedCategories, branchId }) => {
    setLoading(true);
    let allGoods = [];
    try {
      const res = await fetch(APIEndpoints.GETGOODSBYCATEGORYNAMES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          category: selectedCategories,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        allGoods = data.data;
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

    return mapGoodsToCategories(allGoods);
  }, []);

  return { loading, getGoods };
};

const mapGoodsToCategories = (goods) => {
  let mappedGoods = {};
  goods.forEach((good) => {
    if (mappedGoods[good.categoryId]) {
      mappedGoods[good.categoryId].push(good);
    } else {
      mappedGoods[good.categoryId] = [good];
    }
  });

  return mappedGoods;
};

export default useGetGoodsByCategoryNames;
