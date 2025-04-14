import Navbar from "../components/navbar/Navbar";
import useGetAccessibleBranches from "../hooks/useGetAccessibleBranches";
import IndividualBranchUsers from "../components/branchUsers/IndividualBranchUsers";
import AdminUsers from "../components/branchUsers/AdminUsers";
import { useState, useEffect } from "react";
import Spinner from "../components/spinner/Spinner";
import { PagesLink } from "../constants/constants";

const ManageUsers = () => {
  const { loading, getAccessibleBranches } = useGetAccessibleBranches();
  const [accessibleBranches, setAccessibleBranches] = useState([]);
  const [networkReq, setNetworkReq] = useState(false);

  useEffect(() => {
    const fetchAccessibleBranches = async () => {
      const branches = await getAccessibleBranches();
      setAccessibleBranches(branches);
      setNetworkReq(true);
    };
    fetchAccessibleBranches();
  }, [getAccessibleBranches]);

  return (
    <>
      <Navbar currentPageName={PagesLink.MANAGE_USERS.name} />
      <div
        className="min-h-screen p-3 sm:p-8
    flex flex-col text-white dark:text-black bg-gray-300 dark:bg-gray-100 border-y-4 border-black transition-all duration-300 ease-in-out 
    "
      >
        {loading ? (
          <Spinner
            loadingMessageStyles="text-4xl font-bold text-black"
            loadingMessage="Fetching accessible branches..."
          />
        ) : networkReq && accessibleBranches.length === 0 ? (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-l-4 border-red-600 dark:border-red-400 px-6 py-6 rounded-lg shadow-lg max-w-lg text-center animate-fadeIn">
            <h2 className="text-3xl sm:text-4xl font-bold">
              No Branches Accessible
            </h2>
            <p className="text-lg sm:text-xl mt-2">
              You don&apos;t have access to any branches yet.
            </p>
          </div>
        ) : (
          <>
            <h2
              className={`text-2xl sm:text-4xl font-bold text-center ${
                accessibleBranches?.length ? "block" : "hidden"
              } mb-8 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 text-white dark:text-black shadow-md`}
            >
              Manage Users
            </h2>
            <div className="flex flex-col gap-4 max-h-full p-2 px-8 my-16 ">
              {accessibleBranches.map((branch) => (
                <IndividualBranchUsers
                  key={branch.branchId}
                  branch={branch}
                  allBranches={accessibleBranches}
                />
              ))}
              <AdminUsers />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ManageUsers;
