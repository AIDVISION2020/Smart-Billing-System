import useLogout from "@/hooks/useLogout";
import { useState, useEffect } from "react";
import ConfirmModal from "../modals/confirmModal";
import Spinner from "@/components/spinner/Spinner";
import { AppNameFull } from "../../constants/constants";

const Logout = () => {
  const { loading, logout } = useLogout();
  const [response, setResponse] = useState(false);

  useEffect(() => {
    if (response) logout();
  }, [response, logout]);

  const confirmMessage = `Are you sure you want to logout?`;
  const yesMessage = `Logout from ${AppNameFull}`;
  const noMessage = "Stay logged in";
  const toggalModalMessage = "Logout";

  const extraStyles = "fixed z-50 bg-opacity-70 bg-black";
  const loadingMessage = "Logging out...";

  return (
    <>
      {loading ? (
        <Spinner extraStyles={extraStyles} loadingMessage={loadingMessage} />
      ) : (
        <ConfirmModal
          confirmMessage={confirmMessage}
          yesMessage={yesMessage}
          noMessage={noMessage}
          toggalModalMessage={toggalModalMessage}
          setResponse={setResponse}
          negativeElement={true}
        ></ConfirmModal>
      )}
    </>
  );
};

export default Logout;
