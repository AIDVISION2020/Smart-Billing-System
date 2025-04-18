import propTypes from "prop-types";

const AutomaticItemAddition = ({
  setCurrItem,
  setImage,
  branchId,
  currCategory,
  setCurrCategory,
}) => {
  return (
    <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300">
      <p className="text-lg">Automatic Item Addition</p>
    </div>
  );
};

AutomaticItemAddition.propTypes = {
  setCurrItem: propTypes.func.isRequired,
  setImage: propTypes.func.isRequired,
  branchId: propTypes.string.isRequired,
  currCategory: propTypes.string.isRequired,
  setCurrCategory: propTypes.func.isRequired,
};

export default AutomaticItemAddition;
