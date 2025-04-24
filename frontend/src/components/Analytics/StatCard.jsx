import propTypes from "prop-types";
const StatCard = ({ title, value }) => (
  <div className="flex sm:flex-col justify-between items-center p-3 sm:p-4 bg-white shadow rounded-2xl w-full sm:w-[180px] h-auto">
    <span className="text-sm text-gray-500 font-medium">{title}</span>
    <span className="text-lg sm:text-xl font-bold text-gray-800">{value}</span>
  </div>
);

StatCard.propTypes = {
  title: propTypes.string.isRequired,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
};

export default StatCard;
