import PropTypes from "prop-types";
import ConfirmModal from "../modals/confirmModal";
import UpdateBranchModal from "../modals/UpdateBranchModal";
import useDeleteBranch from "../../hooks/useDeleteBranch";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const BranchCardTools_Admin = ({
  branchId,
  branchLocation,
  setBranchListUpdCount,
}) => {
  const [deleteResponse, setDeleteResponse] = useState(false);
  const [openUpdBranchModal, setOpenUpdBranchModal] = useState(false);
  const { deleteBranch } = useDeleteBranch();

  useEffect(() => {
    if (deleteResponse) {
      deleteBranch({
        branchId,
      });
      setDeleteResponse(false);
      setBranchListUpdCount((prev) => prev + 1);
    }
  }, [deleteResponse, deleteBranch, branchId, setBranchListUpdCount]);

  const confirmMessage = `Are you sure you want to delete this branch?`;
  const yesMessage = "Delete";
  const noMessage = "Cancel";
  const toggalModalMessage = <Trash2 size={24} strokeWidth={3} color={"red"} />;

  return (
    <div className="w-full flex justify-end items-center ">
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
        setResponse={setDeleteResponse}
      />
    </div>
  );
};

BranchCardTools_Admin.propTypes = {
  branchId: PropTypes.string.isRequired,
  branchLocation: PropTypes.string.isRequired,
  setBranchListUpdCount: PropTypes.func.isRequired,
};

export default BranchCardTools_Admin;
