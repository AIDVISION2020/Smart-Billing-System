import { AppNameFull } from "../constants/constants.js";
import { useAuthContext } from "@/context/authContext";
import { User } from "lucide-react";
import Dropdown from "../components/dropdown/Dropdown.jsx";
import Logout from "../components/logout/Logout.jsx";
import AllBranches from "../components/allBranches/AllBranches.jsx";
import SelectedBranch from "../components/selectedBranch/SelectedBranch.jsx";

import { useState } from "react";

const LandingPage = () => {
  const { authUser } = useAuthContext();
  const [selectedBranch, setSelectedBranch] = useState(null);

  const dropDownElements = [
    <div
      className={`px-8 py-1 border-b-2 border-gray-700 cursor-default ${
        authUser?.role === "admin" ? "bg-red-500" : "bg-green-500"
      }`}
      key="user-role"
    >
      {authUser?.role}
    </div>,
    <div
      className="px-8 py-1 border-b-2 border-gray-700 uppercase cursor-default"
      key="user-username"
    >
      {authUser?.username}
    </div>,
    <Logout key="logout-button" />,
  ];

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
        <nav className="flex items-center">
          <h1 className="sm:px-4 px-1 py-4 text-center font-bold text-3xl sm:text-6xl flex-grow">
            {AppNameFull}
          </h1>
          <div className="w-10 h-10 rounded-full mx-1 sm:mx-10 b border-black border-4 flex items-center justify-center cursor-pointer ">
            <Dropdown
              dropDownElements={dropDownElements}
              openButton={<User size={24} />}
            />
          </div>
        </nav>
        <AllBranches
          userRole={authUser?.role}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
        {selectedBranch && (
          <SelectedBranch
            selectedBranch={selectedBranch}
            key={selectedBranch}
          />
        )}
      </div>
    </>
  );
};

export default LandingPage;
