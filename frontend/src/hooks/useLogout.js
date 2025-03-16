import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/authContext";
import { APIEndpoints } from "@/constants/constants";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = () => {
    setLoading(true);
    const actuallyLogOut = async () => {
      const res = await fetch(APIEndpoints.LOGOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.removeItem("sbs-user");
      setAuthUser(null);
    };

    toast.promise(actuallyLogOut(), {
      loading: "Logging out",
      success: "Logged out successfully",
      error: (err) => err,
    });

    setLoading(false);
  };

  return { loading, logout };
};
export default useLogout;
