import { CirclePlus } from "lucide-react";
import NewBranchModal from "../modals/NewBranchModal";
import { useState } from "react";
import PropTypes from "prop-types";

const NewBranchCard = ({ setBranchListUpdCount }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full flex justify-center items-center p-4">
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-700 dark:border-gray-400 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all justify-center"
      >
        <CirclePlus size={20} />
        <span className="font-medium">Add Branch</span>
      </button>

      {showModal && (
        <NewBranchModal
          showModal={showModal}
          setShowModal={setShowModal}
          setBranchListUpdCount={setBranchListUpdCount}
        />
      )}
    </div>
  );
};

NewBranchCard.propTypes = {
  setBranchListUpdCount: PropTypes.func.isRequired,
};

export default NewBranchCard;
