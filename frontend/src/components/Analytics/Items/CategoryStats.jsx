import PropTypes from "prop-types";
import StatCard from "../StatCard";
import PieChatCard from "../PieChartCard";

const METRICS = [
  { value: "totalSales", label: "Total Sales", isCurrency: true },
  { value: "totalItemsSold", label: "Items Sold" },
  { value: "totalBills", label: "Bills included in" },
  { value: "totalTax", label: "Tax", isCurrency: true },
];

const formatValue = (value, isCurrency) => {
  if (value == null) return "-";
  return isCurrency ? `₹${Number(value).toFixed(2)}` : value;
};

const CategoryStats = ({ categoryData }) => {
  return (
    <div className="rounded-2xl p-4 w-full">
      <div className="bg-pink-600 text-white shadow-md rounded-2xl px-4 py-2 sm:py-4 sm:px-6 mb-6 w-fit">
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Category</h2>
        <p className="text-lg sm:text-xl font-semibold">
          {categoryData.categoryName}
          {" - "}
          <span className="text-sm">{categoryData.categoryId}</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-4 mb-6 justify-evenly items-center">
        {METRICS.map(({ value, label, isCurrency }) => (
          <StatCard
            key={value}
            title={label}
            value={formatValue(categoryData[value], isCurrency)}
          />
        ))}
      </div>

      {/* Items Contribution Chart */}
      {categoryData.items && categoryData.items.length > 0 ? (
        <PieChatCard
          data={categoryData.items}
          metricOptions={METRICS}
          title={"Item Contribution"}
          nameKey="name"
        />
      ) : (
        <p className="text-sm text-gray-500 italic">No item data available.</p>
      )}
    </div>
  );
};

CategoryStats.propTypes = {
  categoryData: PropTypes.object.isRequired,
};

export default CategoryStats;
