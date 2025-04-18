import Dropdown from "../dropdown/Dropdown";
import { User } from "lucide-react";
import { AppNameFull, Roles, PagesLink } from "../../constants/constants";
import { useAuthContext } from "@/context/authContext";
import Logout from "../logout/Logout";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Navbar = ({
  dropDownElements = [],
  disableDefaultNavigations = false,
  currentPageName = null,
}) => {
  const { authUser } = useAuthContext();

  const generateNavItem = (page) => {
    const isActive = currentPageName === page.name;
    const commonClasses =
      "text-center block px-4 py-2 text-white shadow-md transition-all duration-300";
    const activeClasses = "bg-green-600 cursor-not-allowed";
    const defaultClasses =
      "bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700";

    if (isActive) {
      return (
        <div key={page.name} className={`${commonClasses} ${activeClasses}`}>
          {page.name}
        </div>
      );
    }

    return (
      <Link
        key={page.name}
        to={page.link}
        className={`${commonClasses} ${defaultClasses}`}
      >
        {page.name}
      </Link>
    );
  };

  const navigations = disableDefaultNavigations
    ? dropDownElements
    : authUser?.role === Roles.ADMIN
    ? [
        generateNavItem(PagesLink.LANDING),
        generateNavItem(PagesLink.MANAGE_USERS),
        generateNavItem(PagesLink.MANAGE_GOODS),
        generateNavItem(PagesLink.BILLING),
        ...dropDownElements,
      ]
    : [null];

  dropDownElements = [
    <div
      className="px-8 py-1 border-b-2 border-gray-700 uppercase cursor-default"
      key="user-username"
    >
      {authUser?.username}
    </div>,
    ...navigations,
    <Logout key="logout-button" />,
  ];

  return (
    <nav className="flex items-center justify-between sm:px-6 py-4 border-b border-gray-300 dark:border-gray-700">
      <Link
        to={PagesLink.LANDING.link}
        className="text-center font-bold sm:font-extrabold text-xl sm:text-2xl md:text-4xl lg:text-6xl flex-grow"
      >
        {AppNameFull}
      </Link>
      <div className="flex items-center gap-x-4">
        <span
          className={`px-3 py-1 text-sm sm:text-lg font-medium rounded-full ${
            authUser?.role === Roles.ADMIN
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {authUser?.role}
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
  disableDefaultNavigations: PropTypes.bool,
  currentPageName: PropTypes.string,
};

export default Navbar;
