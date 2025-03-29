import { useAuthContext } from "@/context/authContext";
import AllBranches from "../components/allBranches/AllBranches.jsx";
import SelectedBranch from "../components/selectedBranch/SelectedBranch.jsx";
import { useState } from "react";
import Navbar from "../components/navbar/Navbar.jsx";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const { authUser } = useAuthContext();
  const [selectedBranch, setSelectedBranch] = useState(null);

  const navigateToManagerUsers = (
    <Link
      to="/manage-users"
      className="text-center block px-4 py-2 text-white bg-blue-600 shadow-md hover:bg-blue-700 transition-all duration-300 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      Manage Users
    </Link>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar
        dropDownElements={[
          authUser?.role === "admin" ? navigateToManagerUsers : null,
        ]}
      />
      <AllBranches
        userRole={authUser?.role}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
      />
      {selectedBranch && (
        <SelectedBranch selectedBranch={selectedBranch} key={selectedBranch} />
      )}
    </div>
  );
};

export default LandingPage;
