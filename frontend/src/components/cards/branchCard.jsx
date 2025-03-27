import PropTypes from "prop-types";
import { MapPin } from "lucide-react";
import { useAuthContext } from "@/context/authContext";
import BranchCardTools_Admin from "../adminComponents/branchCard_tools";

const BranchCard = ({
  branchId,
  branchLocation,
  setBranchListUpdCount,
  setSelectedBranch,
  selectedBranch,
}) => {
  const { authUser } = useAuthContext();

  const handleCardClick = () => {
    setSelectedBranch((prev) => {
      return prev === branchId ? null : branchId;
    });
  };

  return (
    <>
      {/* Branch Card */}
      <div
        className={`group m-2 border-4 border-black bg-white dark:bg-gray-700 text-black dark:text-white text-xl  flex flex-col justify-evenly items-center ${
          !selectedBranch
            ? "min-h-[250px] px-2 py-2 rounded-xl border-4"
            : "rounded-full border-2"
        } shadow-lg transition-all duration-300 hover:shadow-xl  hover:border-gray-500 dark:hover:border-gray-400 cursor-pointer`}
        onClick={selectedBranch ? handleCardClick : undefined}
      >
        {authUser?.role === "admin" && !selectedBranch && (
          <BranchCardTools_Admin
            branchId={branchId}
            branchLocation={branchLocation}
            setBranchListUpdCount={setBranchListUpdCount}
          />
        )}
        <div
          className={`${
            !selectedBranch && "px-12 py-8"
          } flex flex-col items-center gap-1`}
        >
          <h1
            className={`${
              !selectedBranch
                ? "text-xl sm:text-3xl font-bold rounded-lg bg-green-600 group-hover:bg-green-700"
                : `${
                    selectedBranch === branchId
                      ? "bg-blue-600 group-hover:bg-blue-700"
                      : "bg-green-600 group-hover:bg-green-700"
                  }text-md sm:text-xl font-semibold rounded-full`
            }  text-white px-6 py-2 shadow-md transition-all duration-30  truncate`}
          >
            {!selectedBranch
              ? `Branch ID: ${branchId}`
              : `${branchId} - ${branchLocation}`}
          </h1>
          {!selectedBranch && (
            <>
              <div className="flex items-center gap-2 px-8 py-2 rounded-xl shadow-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 transition-all duration-300 group-hover:shadow-2xl group-hover:from-gray-200 group-hover:to-gray-300 dark:group-hover:from-gray-700 dark:group-hover:to-gray-600">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full shadow-md transition-all duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                  <MapPin
                    size={30}
                    strokeWidth={3}
                    className="text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                  />
                </div>

                {/* Location Text */}
                <h2 className="text-md sm:text-xl font-semibold text-gray-900 dark:text-gray-200 min-w-0 truncate transition-all duration-300">
                  {branchLocation}
                </h2>
              </div>
              <button
                className="mt-1 px-8 py-3 text-lg sm:text-xl font-semibold bg-blue-600 text-white rounded-full shadow-md transition-all duration-300 hover:bg-blue-800 hover:px-10"
                onClick={handleCardClick}
              >
                Enter
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

BranchCard.propTypes = {
  branchId: PropTypes.string.isRequired,
  branchLocation: PropTypes.string.isRequired,
  setBranchListUpdCount: PropTypes.func.isRequired,
  setSelectedBranch: PropTypes.func.isRequired,
  selectedBranch: PropTypes.string,
};

export default BranchCard;
