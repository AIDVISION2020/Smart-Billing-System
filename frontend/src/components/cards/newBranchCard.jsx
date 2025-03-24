import { CirclePlus } from "lucide-react";
import NewBranchModal from "../modals/NewBranchModal";
import { useState } from "react";
import PropTypes from "prop-types";

const NewBranchCard = ({ setBranchListUpdCount }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="group m-2 py-6 px-12 border-4 border-gray-900 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white text-xl rounded-2xl flex flex-col justify-center items-center min-h-[140px] gap-4 shadow-md transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:border-gray-600 dark:hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
        <span className="text-xl sm:text-2xl font-bold tracking-wide text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 rounded-lg shadow-md transition-all duration-300 group-hover:from-blue-400 group-hover:to-indigo-500 group-hover:scale-105">
          Add New Branch
        </span>
        <CirclePlus
          size={70}
          className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110 text-gray-900 dark:text-gray-200"
          onClick={() => setShowModal(true)}
        />
      </div>
      {showModal && (
        <NewBranchModal
          showModal={showModal}
          setShowModal={setShowModal}
          setBranchListUpdCount={setBranchListUpdCount}
        />
      )}
    </>
  );
};

NewBranchCard.propTypes = {
  setBranchListUpdCount: PropTypes.func.isRequired,
};

export default NewBranchCard;
