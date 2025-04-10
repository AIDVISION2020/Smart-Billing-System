import PropTypes from "prop-types";
import { ListCollapse, Plus } from "lucide-react";
import NewUserModal from "../modals/NewUserModal";
import { Roles } from "../../constants/constants";
import { useState } from "react";
const ManageUsers_BranchAccordion = ({
  included,
  setIncluded,
  branch,
  setUsersListUpdCnt,
}) => {
  const [openNewBranchManagerModal, setOpenNewBranchManagerModal] =
    useState(false);
  const [openNewBillerModal, setopenNewBillerModal] = useState(false);
  return (
    <>
      <div
        className={`p-4 rounded-xl shadow-xl border transition-all duration-300 
${
  included
    ? "bg-blue-500/20 border-blue-500 text-blue-500 dark:bg-blue-400/20 dark:border-blue-400"
    : "bg-gray-800/50 border-gray-700 text-white dark:bg-gray-100/50 dark:border-gray-300 dark:text-black hover:bg-gray-700/40 dark:hover:bg-gray-200/40"
}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-grow justify-start">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIncluded(branch)}
            >
              <ListCollapse
                size={24}
                className={`${
                  included ? "text-gray-400 dark:text-gray-600" : ""
                } `}
              />
              <h2 className="text-lg sm:text-xl font-medium">
                {branch.branchId} - {branch.location || branch.branchName}
              </h2>
            </div>
          </div>
          <div className="flex justify-evenly items-center gap-x-2">
            {included && (
              <>
                <button
                  className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md hover:scale-105 hover:brightness-110 transition-all duration-200 font-semibold text-sm sm:text-base"
                  onClick={() => setOpenNewBranchManagerModal(true)}
                >
                  <Plus size={18} />
                  {branch.branchId !== "0" ? "BranchAdmin" : "Admin"}
                </button>

                {openNewBranchManagerModal && (
                  <NewUserModal
                    showModal={openNewBranchManagerModal}
                    setShowModal={setOpenNewBranchManagerModal}
                    branchId={branch.branchId}
                    setUsersListUpdCnt={setUsersListUpdCnt}
                    role={
                      branch.branchId === "0" ? Roles.ADMIN : Roles.BRANCHADMIN
                    }
                  />
                )}
                {branch.branchId !== "0" && (
                  <>
                    <button
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md hover:scale-105 hover:brightness-110 transition-all duration-200 font-semibold text-sm sm:text-base"
                      onClick={() => setopenNewBillerModal(true)}
                    >
                      <Plus size={18} />
                      Biller
                    </button>
                    {openNewBillerModal && (
                      <NewUserModal
                        showModal={openNewBillerModal}
                        setShowModal={setopenNewBillerModal}
                        branchId={branch.branchId}
                        setUsersListUpdCnt={setUsersListUpdCnt}
                        role={Roles.BILLER}
                      />
                    )}
                  </>
                )}
              </>
            )}
            <div
              className={`px-4 py-1 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 cursor-pointer
  ${
    included
      ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-black shadow-md"
      : "bg-gray-700 text-gray-300 dark:bg-gray-300 dark:text-gray-700 hover:bg-gray-600 dark:hover:bg-gray-400"
  }`}
              onClick={() => setIncluded(branch)}
            >
              {included ? "Selected" : "Select"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ManageUsers_BranchAccordion.propTypes = {
  included: PropTypes.bool.isRequired,
  setIncluded: PropTypes.func.isRequired,
  branch: PropTypes.object.isRequired,
  setUsersListUpdCnt: PropTypes.func.isRequired,
};

export default ManageUsers_BranchAccordion;
