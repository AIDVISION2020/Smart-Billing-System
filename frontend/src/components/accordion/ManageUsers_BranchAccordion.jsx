import PropTypes from "prop-types";
import { ListCollapse, Plus, MoreVertical, X } from "lucide-react";
import NewUserModal from "../modals/NewUserModal";
import { Roles } from "../../constants/constants";
import { useEffect, useState } from "react";
import BranchCardTools_Admin from "../adminComponents/branchCard_tools";

const ManageUsers_BranchAccordion = ({
  included,
  setIncluded,
  branch,
  setUsersListUpdCnt,
  setBranchListUpdCount,
}) => {
  const [openNewBranchManagerModal, setOpenNewBranchManagerModal] =
    useState(false);
  const [openNewBillerModal, setopenNewBillerModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!included) setShowDropdown(false);
  }, [included]);

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
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-grow justify-start">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIncluded(branch)}
            >
              <ListCollapse
                size={24}
                className={`${
                  included ? "text-gray-400 dark:text-gray-600" : ""
                }`}
              />
              <h2 className="text-lg sm:text-xl font-medium">
                {branch.branchId} - {branch.location || branch.branchName}
              </h2>
            </div>
          </div>

          {/* Actions */}
          <div className="relative flex items-center gap-x-2">
            {/* Large screens: button group */}
            <div className="hidden sm:flex gap-x-2 items-center">
              {included && (
                <>
                  <button
                    className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md hover:scale-105 hover:brightness-110 transition-all duration-200 font-semibold text-sm sm:text-base"
                    onClick={() => setOpenNewBranchManagerModal(true)}
                  >
                    <Plus size={18} />
                    {branch.branchId !== "0" ? "BranchAdmin" : "Admin"}
                  </button>
                  {branch.branchId !== "0" && (
                    <button
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md hover:scale-105 hover:brightness-110 transition-all duration-200 font-semibold text-sm sm:text-base"
                      onClick={() => setopenNewBillerModal(true)}
                    >
                      <Plus size={18} />
                      Biller
                    </button>
                  )}
                </>
              )}
              {branch.branchId !== "0" && included && (
                <BranchCardTools_Admin
                  branchId={branch.branchId}
                  branchLocation={branch.location}
                  setBranchListUpdCount={setBranchListUpdCount}
                />
              )}
            </div>

            {/* Small screens: dropdown menu */}
            {included && (
              <div className="sm:hidden relative">
                <button onClick={() => setShowDropdown(!showDropdown)}>
                  {showDropdown ? <X size={24} /> : <MoreVertical size={24} />}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 top-10 z-50 flex flex-col bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg p-2 gap-2 w-48">
                    {included && (
                      <>
                        <button
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                          onClick={() => {
                            setShowDropdown(false);
                            setOpenNewBranchManagerModal(true);
                          }}
                        >
                          {branch.branchId !== "0"
                            ? "Add BranchAdmin"
                            : "Add Admin"}
                        </button>
                        {branch.branchId !== "0" && (
                          <button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                            onClick={() => {
                              setShowDropdown(false);
                              setopenNewBillerModal(true);
                            }}
                          >
                            Add Biller
                          </button>
                        )}
                      </>
                    )}
                    {branch.branchId !== "0" && included && (
                      <BranchCardTools_Admin
                        branchId={branch.branchId}
                        branchLocation={branch.location}
                        setBranchListUpdCount={setBranchListUpdCount}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Select / Selected button */}
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

      {/* Modals */}
      {openNewBranchManagerModal && (
        <NewUserModal
          showModal={openNewBranchManagerModal}
          setShowModal={setOpenNewBranchManagerModal}
          branchId={branch.branchId}
          setUsersListUpdCnt={setUsersListUpdCnt}
          role={branch.branchId === "0" ? Roles.ADMIN : Roles.BRANCHADMIN}
        />
      )}
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
  );
};

ManageUsers_BranchAccordion.propTypes = {
  included: PropTypes.bool.isRequired,
  setIncluded: PropTypes.func.isRequired,
  branch: PropTypes.object.isRequired,
  setUsersListUpdCnt: PropTypes.func.isRequired,
  setBranchListUpdCount: PropTypes.func.isRequired,
};

export default ManageUsers_BranchAccordion;
