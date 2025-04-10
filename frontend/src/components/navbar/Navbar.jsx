import Dropdown from "../dropdown/Dropdown";
import { User } from "lucide-react";
import { AppNameFull, Roles } from "../../constants/constants";
import { useAuthContext } from "@/context/authContext";
import Logout from "../logout/Logout";
import PropTypes from "prop-types";

const Navbar = ({ dropDownElements = [] }) => {
  const { authUser } = useAuthContext();

  dropDownElements = [
    <div
      className="px-8 py-1 border-b-2 border-gray-700 uppercase cursor-default"
      key="user-username"
    >
      {authUser?.username}
    </div>,
    ...dropDownElements,
    <Logout key="logout-button" />,
  ];

  return (
    <nav className="flex items-center justify-between sm:px-6 py-4 border-b border-gray-300 dark:border-gray-700">
      <h1 className="text-center font-bold sm:font-extrabold text-xl sm:text-2xl md:text-4xl lg:text-6xl flex-grow">
        {AppNameFull}
      </h1>
      <div className="flex items-center gap-x-4">
        <span
          className={`px-3 py-1 text-sm sm:text-lg font-medium rounded-full ${
            authUser?.role === Roles.ADMIN
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {authUser?.role === Roles.ADMIN ? Roles.ADMIN : Roles.BRANCHADMIN}
        </span>
        <div className="w-12 h-12 rounded-full border-4 border-black flex items-center justify-center cursor-pointer">
          <Dropdown
            dropDownElements={dropDownElements}
            openButton={<User size={28} />}
          />
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  dropDownElements: PropTypes.array,
  navbarLinks: PropTypes.array,
};

export default Navbar;
