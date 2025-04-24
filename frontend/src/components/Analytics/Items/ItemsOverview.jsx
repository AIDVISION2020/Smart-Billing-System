import { useState, useEffect, useCallback } from "react";
import Spinner from "../../Spinner/Spinner";
import { ChevronDown } from "lucide-react";
import useGetBranchSummary from "../../../hooks/useGetBranchSummary";
import toast from "react-hot-toast";
import PieChatCard from "../PieChartCard";
import BranchStats from "./BranchStats";
import StatCard from "../StatCard";
import AnalysisDatePicker from "../AnalysisDatePicker";

const METRIC_OPTIONS = [
  { value: "totalSales", label: "Total Sales", isCurrency: true },
  { value: "totalItemsSold", label: "Items Sold" },
  { value: "totalBills", label: "Total Bills" },
  { value: "totalDiscount", label: "Total Discount", isCurrency: true },
  { value: "totalTax", label: "Total Tax", isCurrency: true },
];

const ItemsOverview = () => {
  const today = new Date().toISOString().split("T")[0];
  const { getBranchSummary } = useGetBranchSummary();

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    () => new Date(new Date().setDate(1)).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today);
  const [allBranches, setAllBranches] = useState([]);
  const [hasFetchedInitially, setHasFetchedInitially] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [allBranchStats, setAllBranchStats] = useState([]);

  const fetchBranchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        toast.error("The time period selected is invalid");
        return;
      }
      end.setHours(23, 59, 59, 999);
      const data = await getBranchSummary({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      setAllBranches(data);
      setAllBranchStats({
        totalSales: data.reduce((acc, branch) => acc + branch.totalSales, 0),
        totalItemsSold: data.reduce(
          (acc, branch) => acc + branch.totalItemsSold,
          0
        ),
        totalBills: data.reduce((acc, branch) => acc + branch.totalBills, 0),
        totalDiscount: data.reduce(
          (acc, branch) => acc + branch.totalDiscount,
          0
        ),
        totalTax: data.reduce((acc, branch) => acc + branch.totalTax, 0),
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, getBranchSummary]);

  useEffect(() => {
    if (!hasFetchedInitially) {
      fetchBranchSummary();
      setHasFetchedInitially(true);
    }
  }, [hasFetchedInitially, fetchBranchSummary]);

  return (
    <div className="px-1 py-4 sm:p-4 w-full flex flex-col items-center dark:bg-gray-900 rounded-lg shadow-md">
      {loading ? (
        <Spinner
          loadingMessageStyles="text-4xl font-semibold"
          loadingMessage={"Fetching branch summary..."}
        />
      ) : (
        <>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 text-gray-800">
            Branches Overview
          </h2>
          <AnalysisDatePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onRefresh={fetchBranchSummary}
            loading={loading}
          />
          <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
            <PieChatCard
              data={allBranches}
              metricOptions={METRIC_OPTIONS}
              title={"Branches Overview"}
              nameKey="location"
            />

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 justify-center items-center w-full sm:w-[400px]">
              {METRIC_OPTIONS.map(({ value, label, isCurrency }) => (
                <StatCard
                  key={value}
                  title={label}
                  value={
                    isCurrency
                      ? `₹${Number(allBranchStats[value] || 0).toFixed(2)}`
                      : allBranchStats[value] ?? "-"
                  }
                />
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center rounded-lg my-6 py-6 sm:px-4">
            {/* Branch Dropdown */}
            <div className="flex items-center gap-2 w-full justify-center bg-gray-300 py-2 px-4 rounded-2xl">
              <label
                htmlFor="branchID"
                className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap"
              >
                Branch ID
              </label>
              <div className="relative w-full sm:w-[200px]">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-4 py-2 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                >
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                    {selectedBranch?.branchId ?? "Select"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <ul className="absolute w-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-auto max-h-36 custom-scrollbar dark-scroll divide-y divide-gray-200 dark:divide-gray-700">
                    {allBranches.map((branch) => (
                      <li
                        key={branch.branchId}
                        onClick={() => {
                          setSelectedBranch(branch);
                          setSelectedCategory(null);
                          setSelectedItem(null);
                          setIsOpen(false);
                        }}
                        className="cursor-pointer px-4 py-2 transition-all hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
                      >
                        <span className="font-medium">{branch.branchId}</span> -{" "}
                        {branch.location}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {selectedBranch && (
              <BranchStats
                branchData={allBranches.find(
                  (branch) => branch.branchId === selectedBranch?.branchId
                )}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ItemsOverview;
