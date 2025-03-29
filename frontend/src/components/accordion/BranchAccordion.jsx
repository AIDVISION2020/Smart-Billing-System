import PropTypes from "prop-types";
import { ListCollapse, UserPlus } from "lucide-react";
import NewUserModal from "../modals/NewUserModal";
import { useState } from "react";
const BranchAccordion = ({
  included,
  setIncluded,
  branch,
  setUsersListUpdCnt,
}) => {
  const [openNewUserModal, setOpenNewUserModal] = useState(false);
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
          <div className="flex justify-evenly items-center gap-x-4">
            {included && (
              <>
                <UserPlus
                  size={40}
                  className="text-white dark:text-green-400 
             bg-gradient-to-r from-blue-500 to-green-400 
             p-2 rounded-full shadow-lg 
             hover:scale-110 transition-transform duration-300 cursor-pointer"
                  strokeWidth={3}
                  onClick={() => setOpenNewUserModal(true)}
                />
                {openNewUserModal && (
                  <NewUserModal
                    showModal={openNewUserModal}
                    setShowModal={setOpenNewUserModal}
                    branchId={branch.branchId}
                    setUsersListUpdCnt={setUsersListUpdCnt}
                    role={branch.branchId === "0" ? "admin" : "user"}
                  />
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

BranchAccordion.propTypes = {
  included: PropTypes.bool.isRequired,
  setIncluded: PropTypes.func.isRequired,
  branch: PropTypes.object.isRequired,
  setUsersListUpdCnt: PropTypes.func.isRequired,
};

export default BranchAccordion;
