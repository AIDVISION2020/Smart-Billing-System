import PropTypes from "prop-types";
import { MapPin, Trash2, Pencil } from "lucide-react";
import { useAuthContext } from "@/context/authContext";
import ConfirmModal from "../modals/confirmModal";
import { useState, useEffect } from "react";
import useDeleteBranch from "../../hooks/useDeleteBranch";
import UpdateBranchModal from "../modals/UpdateBranchModal";

const BranchCard = ({ branchId, branchLocation, setBranchListUpdCount }) => {
  const { authUser } = useAuthContext();
  const [response, setResponse] = useState(false);
  const [openUpdBranchModal, setOpenUpdBranchModal] = useState(false);

  const { deleteBranch } = useDeleteBranch();

  useEffect(() => {
    if (response) {
      deleteBranch({
        branchId,
      });
      setResponse(false);
      setBranchListUpdCount((prev) => prev + 1);
    }
  }, [response, deleteBranch, branchId, setBranchListUpdCount]);

  const confirmMessage = `Are you sure you want to delete this branch?`;
  const yesMessage = "Delete";
  const noMessage = "Cancel";
  const toggalModalMessage = <Trash2 size={24} strokeWidth={3} color={"red"} />;

  return (
    <>
      {/* Branch Card */}
      <div className="group m-2 px-2 py-2 border-4 border-black bg-white dark:bg-gray-700 text-black dark:text-white text-xl rounded-xl flex flex-col justify-evenly items-center min-h-[250px] shadow-lg transition-all duration-300 hover:shadow-xl  hover:border-gray-500 dark:hover:border-gray-400 cursor-pointer">
        {authUser?.role === "admin" && (
          <div className="w-full flex justify-end items-center">
            {/* Update branch */}
            <>
              <Pencil
                size={24}
                strokeWidth={3}
                className="text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                onClick={() => setOpenUpdBranchModal(true)}
              />
              {openUpdBranchModal && (
                <UpdateBranchModal
                  showModal={openUpdBranchModal}
                  setShowModal={setOpenUpdBranchModal}
                  setBranchListUpdCount={setBranchListUpdCount}
                  currBranchId={branchId}
                  currLocation={branchLocation}
                />
              )}
            </>

            {/* Delete branch */}
            <ConfirmModal
              confirmMessage={confirmMessage}
              yesMessage={yesMessage}
              noMessage={noMessage}
              toggalModalMessage={toggalModalMessage}
              setResponse={setResponse}
            />
          </div>
        )}
        <div className="px-12 py-8">
          <h1 className="text-xl sm:text-3xl font-bold bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 group-hover:bg-green-700 truncate">
            Branch ID: {branchId}
          </h1>
          <div className="w-full flex justify-center items-center gap-4 bg-gray-100 dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md transition-all duration-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-900">
            <MapPin
              size={30}
              strokeWidth={3}
              className="text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300"
            />
            <h2 className="text-md sm:text-xl font-semibold text-gray-900 dark:text-gray-200 min-w-0 truncate">
              {branchLocation}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

BranchCard.propTypes = {
  branchId: PropTypes.string.isRequired,
  branchLocation: PropTypes.string.isRequired,
  setBranchListUpdCount: PropTypes.func.isRequired,
};

export default BranchCard;
