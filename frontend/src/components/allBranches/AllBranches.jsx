import NewBranchCard from "../cards/newBranchCard";
import BranchCard from "../cards/branchCard";
import useGetAccessibleBranches from "../../hooks/useGetAccessibleBranches";
import { useState, useEffect } from "react";
import propTypes from "prop-types";
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
        !selectedBranch ? "h-screen p-1 sm:p-6" : "p-1 sm:p-3"
      } flex flex-col  text-white dark:text-black bg-gray-800 dark:bg-gray-100 border-y-4 border-black`}
    >
      <h2
        className={`text-2xl sm:text-4xl ${
          accessibleBranches?.length && !selectedBranch ? "block" : "hidden"
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
            {networkReq && accessibleBranches.length === 0 ? (
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-l-4 border-red-600 dark:border-red-400 px-6 py-4 rounded-lg shadow-lg max-w-lg text-center animate-fadeIn">
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
                } items-center justify-evenly w-[90%]`}
              >
                {accessibleBranches?.map((branch) => {
                  return (
                    <BranchCard
                      key={branch.branchId}
                      branchId={branch.branchId}
                      branchLocation={branch.location}
                      setBranchListUpdCount={setBranchListUpdCount}
                      setSelectedBranch={setSelectedBranch}
                      selectedBranch={selectedBranch}
                    />
                  );
                })}
                {userRole === "admin" && !selectedBranch && (
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
