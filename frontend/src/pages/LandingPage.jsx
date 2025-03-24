import { AppNameFull } from "../constants/constants.js";
import { useAuthContext } from "@/context/authContext";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import Dropdown from "../components/dropdown/Dropdown.jsx";
import Logout from "../components/logout/Logout.jsx";
import BranchCard from "../components/cards/branchCard.jsx";
import NewBranchCard from "../components/cards/newBranchCard.jsx";
import Spinner from "../components/spinner/Spinner.jsx";
import useGetAccessibleBranches from "../hooks/useGetAccessibleBranches.js";

const LandingPage = () => {
  const [branchListUpdCount, setBranchListUpdCount] = useState(0);

  const { authUser } = useAuthContext();
  const { loading, getAccessibleBranches } = useGetAccessibleBranches();
  const [accessibleBranches, setAccessibleBranches] = useState([]);

  useEffect(() => {
    const fetchAccessibleBranches = async () => {
      const branches = await getAccessibleBranches();
      setAccessibleBranches(branches);
    };
    fetchAccessibleBranches();
  }, [branchListUpdCount, getAccessibleBranches]);

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
        <nav className="flex border-b-8 border-black dark:border-gray-500 items-center">
          <h1 className="sm:px-4 px-1 py-4 text-center font-bold text-3xl sm:text-6xl flex-grow">
            {AppNameFull}
          </h1>
          <div className="w-10 h-10 rounded-full mx-1 sm:mx-10 border-black border-4 flex items-center justify-center cursor-pointer ">
            <Dropdown
              dropDownElements={dropDownElements}
              openButton={<User size={24} />}
            />
          </div>
        </nav>
        <div className="flex flex-col p-1 sm:p-6 h-screen text-white dark:text-black bg-gray-800 dark:bg-gray-100">
          <h2
            className={`text-2xl sm:text-4xl ${
              accessibleBranches.length === 0 ? "hidden" : "block"
            } mb-16`}
          >
            Accessible Branches:{" "}
          </h2>
          <div className="flex items-center justify-center flex-wrap w-full overflow-y-auto scrollbar-hide h-full">
            {loading ? (
              <Spinner
                loadingMessageStyles={"text-4xl"}
                loadingMessage={"Fetching accessible Branches..."}
              />
            ) : (
              <>
                {accessibleBranches.length === 0 ? (
                  <h2 className="text-4xl underline">
                    Sorry, but you do not have access to any branch currently.
                  </h2>
                ) : (
                  <div className="flex flex-wrap align-center justify-evenly w-[90%]">
                    {accessibleBranches.map((branch) => {
                      return (
                        <BranchCard
                          key={branch.branchId}
                          branchId={branch.branchId}
                          branchLocation={branch.location}
                          setBranchListUpdCount={setBranchListUpdCount}
                        />
                      );
                    })}
                    {authUser?.role === "admin" && (
                      <NewBranchCard
                        setBranchListUpdCount={setBranchListUpdCount}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
