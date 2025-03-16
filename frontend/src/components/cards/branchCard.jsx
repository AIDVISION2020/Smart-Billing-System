import PropTypes from "prop-types";
import { MapPin } from "lucide-react";

const BranchCard = ({ branchId, branchLocation }) => {
  return (
    <div className="group m-2 px-16 py-8 border-4 border-black bg-white dark:bg-gray-700 text-black dark:text-white text-xl rounded-xl flex flex-col justify-evenly items-center min-h-[250px] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-gray-500 dark:hover:border-gray-400 cursor-pointer">
      <h1 className="text-xl sm:text-3xl font-bold bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 group-hover:bg-green-700 truncate">
        Branch ID: {branchId}
      </h1>
      <div className="w-full flex justify-center items-center gap-4 bg-gray-100 dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md transition-all duration-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-900">
        <MapPin
          size={30}
          strokeWidth={3}
          className="text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300"
        />
        <h2 className="text-md sm:text-xl font-semibold text-gray-900 dark:text-gray-200 min-w-0 truncate">
          {branchLocation}
        </h2>
      </div>
    </div>
  );
};

BranchCard.propTypes = {
  branchId: PropTypes.number.isRequired,
  branchLocation: PropTypes.string.isRequired,
};

export default BranchCard;
