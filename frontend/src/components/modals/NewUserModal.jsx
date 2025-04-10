import { useState } from "react";
import useCreateUser from "../../hooks/useCreateUser";
import Spinner from "@/components/spinner/Spinner";
import { X as Close, UserPlus, Eye, EyeOff, XCircle } from "lucide-react";
import PropTypes from "prop-types";
import { Roles } from "../../constants/constants";

const NewUserModal = ({
  showModal,
  setShowModal,
  setUsersListUpdCnt,
  branchId,
  role,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { loading, createUser } = useCreateUser();
  const [passwordError, setPasswordError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value.trimStart(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");
    const userCreated = await createUser({
      userInfo: { ...newUser, role, branchId },
    });
    if (userCreated) {
      setShowModal(false);
      setNewUser({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setUsersListUpdCnt((prev) => prev + 1);
    }
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
              New User
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white p-2 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              <Close className="w-6 h-6" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal Body */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="flex border-2 border-gray-300 justify-between items-center py-4 px-6 rounded-lg flex-wrap">
              <div>
                <span className="text-gray-800 dark:text-gray-400 font-bold">
                  BranchId :{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-400 font-semibold">
                  {branchId}
                </span>
              </div>
              <div>
                <span className="text-gray-800 dark:text-gray-400 font-bold">
                  Role :{" "}
                </span>
                <span
                  className={`text-gray-800 dark:text-gray-400 font-semibold px-4 py-1 ${
                    role === Roles.ADMIN ? "bg-red-500" : "bg-blue-500"
                  } rounded-full`}
                >
                  {role}
                </span>
              </div>
            </div>
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                placeholder="Enter name"
                required
                minLength={3}
                maxLength={20}
                value={newUser.name}
                onChange={handleChange}
              />
            </div>

            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                placeholder="Enter name"
                required
                minLength={3}
                maxLength={20}
                value={newUser.username}
                onChange={handleChange}
              />
            </div>
            {/* email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                name="email"
                id="email"
                type="email"
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                placeholder="Enter email"
                required
                minLength={2}
                maxLength={30}
                value={newUser.email}
                onChange={handleChange}
              ></input>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={newUser.password}
                  onChange={handleChange}
                  minLength={6}
                  maxLength={20}
                />
                {/* Eye Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  required
                  value={newUser.confirmPassword}
                  onChange={(e) => {
                    setNewUser({ ...newUser, confirmPassword: e.target.value });
                    setPasswordError(""); // Clear error when typing
                  }}
                  minLength={6}
                  maxLength={20}
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" /> {passwordError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-5 py-3 text-white bg-blue-600 rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
            >
              {loading ? (
                <Spinner dotStyles="bg-white h-3 w-3" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create User
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

NewUserModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  setUsersListUpdCnt: PropTypes.func.isRequired,
  branchId: PropTypes.string.isRequired,
  role: PropTypes.oneOf([Roles.ADMIN, Roles.BRANCHADMIN, Roles.BILLER])
    .isRequired,
};

export default NewUserModal;
