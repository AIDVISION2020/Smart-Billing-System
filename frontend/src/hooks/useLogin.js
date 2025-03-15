import { APIEndpoints } from "@/constants/constants";
import { useAuthContext } from "@/context/authContext";
import { useState } from "react";
import toast from "react-hot-toast";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const login = async ({ password, email }) => {
    const success = handleInputErrors({ password, email });
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch(APIEndpoints.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          email,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      } else if (data.message) {
        toast.success(data.message);
      } else {
        localStorage.setItem("sbs-user", JSON.stringify(data));
        setAuthUser(data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};
export default useLogin;

function handleInputErrors({ password, email }) {
  if (!password || !email) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}
