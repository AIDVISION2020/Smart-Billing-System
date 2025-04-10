import { useState, useEffect } from "react";
import useUpdateUser from "@/hooks/useUpdateUser";
import Spinner from "@/components/spinner/Spinner";
import { X as Close, Save, Replace, ChevronDown } from "lucide-react";
import propTypes from "prop-types";
import { Roles } from "../../constants/constants";

const UpdateUserModal = ({
  showModal,
  setShowModal,
  setUsersListUpdCnt,
  currUser,
  allBranches,
}) => {
  const [updatedUser, setUpdatedUser] = useState(() => {
    // eslint-disable-next-line no-unused-vars
    const { email, password, createdAt, updatedAt, ...rest } = currUser;
    return rest;
  });

  const [isOpen, setIsOpen] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);
  const { loading, updateUser } = useUpdateUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  useEffect(() => {
    setIsDisabled(() => {
      for (const key in updatedUser) {
        const updatedValue = updatedUser[key];
        const currentValue = currUser[key];

        if (updatedValue !== currentValue) return false;
      }
      return true;
    });
  }, [updatedUser, currUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in updatedUser) {
      if (typeof updatedUser[key] === "string") {
        updatedUser[key] = updatedUser[key].trim();
      }
    }

    await updateUser({ user: updatedUser });
    setShowModal(false);
    setUsersListUpdCnt((prev) => prev + 1);
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="p-4 w-full max-w-md max-h-[90%] overflow-y-auto custom-scrollbar dark-scroll">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform transition-all duration-300 ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update User
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white p-2 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              <Close className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="flex border-2 border-gray-300 justify-between items-center py-4 px-6 rounded-lg flex-wrap">
              <span className="text-gray-800 dark:text-gray-400 font-bold">
                User ID :{" "}
              </span>
              <span className="text-gray-800 dark:text-gray-400 font-semibold">
                {currUser.userId}
              </span>
            </div>

            {/* Name Input */}
            <div className="text-black dark:text-white">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedUser({ ...updatedUser, name: currUser.name })
                  }
                />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                minLength={3}
                maxLength={20}
                value={updatedUser.name}
                onChange={handleChange}
              />
            </div>

            {/* Username Input */}
            <div className="text-black dark:text-white">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedUser({
                      ...updatedUser,
                      username: currUser.username,
                    })
                  }
                />
              </div>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                minLength={3}
                maxLength={20}
                value={updatedUser.username}
                onChange={handleChange}
              />
            </div>

            {/* Branch Selection */}
            <div className="relative w-full">
              <label
                htmlFor="branchID"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
              >
                Branch ID
              </label>

              {/* Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              >
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {updatedUser.branchId
                    ? updatedUser.branchId
                    : "Select a branch"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <ul className="absolute left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-auto max-h-36 custom-scrollbar dark-scroll divide-y divide-gray-200 dark:divide-gray-700">
                  {allBranches.map((branch) => (
                    <li
                      key={branch.branchId}
                      onClick={() => {
                        setUpdatedUser({
                          ...updatedUser,
                          branchId: branch.branchId,
                        });
                        setIsOpen(false);
                      }}
                      className="cursor-pointer px-4 py-3 transition-all hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
                    >
                      <span className="font-medium">{branch.branchId}</span> -{" "}
                      {branch.location}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Promote or Demote Button */}
            <button
              type="button" // Prevents form submission
              onClick={() =>
                setUpdatedUser((prev) => ({
                  ...prev,
                  role:
                    prev.role === Roles.BRANCHADMIN
                      ? Roles.ADMIN
                      : Roles.BRANCHADMIN,
                }))
              }
              className={`px-4 py-2 mt-4 text-md font-semibold text-white rounded-xl shadow-md transition-all 
    ${
      updatedUser.role === Roles.BRANCHADMIN
        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300"
        : "bg-red-600 hover:bg-red-700 focus:ring-red-300"
    }
  `}
            >
              {updatedUser.role === Roles.BRANCHADMIN
                ? "Promote to Admin"
                : "Demote to User"}
            </button>

            {/* Submit Button */}
            <button
              disabled={isDisabled}
              type="submit"
              className={`w-full flex items-center justify-center px-5 py-3 rounded-lg shadow-lg transition-all duration-300 
                ${
                  isDisabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
                }
              `}
            >
              {loading ? (
                <Spinner dotStyles="bg-white h-3 w-3" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update User
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

UpdateUserModal.propTypes = {
  showModal: propTypes.bool.isRequired,
  setShowModal: propTypes.func.isRequired,
  setUsersListUpdCnt: propTypes.func.isRequired,
  currUser: propTypes.object.isRequired,
  allBranches: propTypes.array.isRequired,
};

export default UpdateUserModal;
