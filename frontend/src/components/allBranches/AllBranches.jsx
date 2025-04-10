import NewBranchCard from "../cards/newBranchCard";
import BranchCard from "../cards/branchCard";
import useGetAccessibleBranches from "../../hooks/useGetAccessibleBranches";
import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { Roles } from "../../constants/constants";
import Spinner from "../spinner/Spinner";

const AllBranches = ({ userRole, selectedBranch, setSelectedBranch }) => {
  const [branchListUpdCount, setBranchListUpdCount] = useState(0);

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
  }, [branchListUpdCount, getAccessibleBranches]);

  return (
    <div
      className={`${
        !selectedBranch ? "h-screen p-3 sm:p-8" : "p-2 sm:p-4"
      } flex flex-col text-white dark:text-black bg-gray-800 dark:bg-gray-100 border-y-4 border-black transition-all duration-300 ease-in-out`}
    >
      {/* Title - Improved Visibility */}
      <h2
        className={`text-2xl sm:text-4xl font-bold text-center ${
          accessibleBranches?.length && !selectedBranch ? "block" : "hidden"
        } mb-8 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 text-white dark:text-black shadow-md`}
      >
        Accessible Branches
      </h2>

      {/* Container for Branch Cards */}
      <div className="flex items-center justify-center flex-wrap w-full overflow-y-auto scrollbar-hide h-full gap-6">
        {/* Loading State */}
        {loading ? (
          <Spinner
            loadingMessageStyles="text-4xl font-semibold"
            loadingMessage="Fetching accessible branches..."
          />
        ) : (
          <>
            {/* No Branches Available Message */}
            {networkReq && accessibleBranches.length === 0 ? (
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-l-4 border-red-600 dark:border-red-400 px-6 py-6 rounded-lg shadow-lg max-w-lg text-center animate-fadeIn">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  No Branches Accessible
                </h2>
                <p className="text-lg sm:text-xl mt-2">
                  You don&apos;t have access to any branches yet.
                </p>
              </div>
            ) : (
              <div
                className={`flex ${
                  !selectedBranch && "flex-wrap"
                } items-center justify-center w-[90%] gap-4 sm:gap-8`}
              >
                {/* Render Branch Cards */}
                {accessibleBranches?.map((branch) => (
                  <BranchCard
                    key={branch.branchId}
                    branchId={branch.branchId}
                    branchLocation={branch.location}
                    setBranchListUpdCount={setBranchListUpdCount}
                    setSelectedBranch={setSelectedBranch}
                    selectedBranch={selectedBranch}
                  />
                ))}

                {/* Admin: Add New Branch Card */}
                {userRole === Roles.ADMIN && !selectedBranch && (
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
  );
};

AllBranches.propTypes = {
  userRole: propTypes.string.isRequired,
  selectedBranch: propTypes.string,
  setSelectedBranch: propTypes.func.isRequired,
};

export default AllBranches;
