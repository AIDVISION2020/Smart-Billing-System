/* eslint-disable react/prop-types */

import { RefreshCcw } from "lucide-react";

const AnalysisDatePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onRefresh,
  loading,
}) => {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 items-center">
      <label className="text-sm text-gray-600">
        <input
          type="date"
          max={today}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </label>
      <span className="text-sm text-gray-600 font-semibold">to</span>
      <label className="text-sm text-gray-600">
        <input
          type="date"
          max={today}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </label>
      <button
        onClick={onRefresh}
        className={`px-2 py-1 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading}
      >
        <RefreshCcw size={20} />
      </button>
    </div>
  );
};

export default AnalysisDatePicker;
