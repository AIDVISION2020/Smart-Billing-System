import { useAuthContext } from "../../../context/authContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useGetBillsSalesSummary,
  useGetBillItemsSalesSummary,
} from "../../../hooks/useGetSalesSummary";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import Spinner from "../../Spinner/Spinner";
import {
  handlePrint,
  getTrendsData,
  exportTopSellingItemsToCSV,
  exportTrendsToCSV,
} from "./utils";
import { ChevronDown } from "lucide-react";
import StatCard from "../StatCard";
import AnalysisDatePicker from "../AnalysisDatePicker";
import useGetAccessibleBranches from "../../../hooks/useGetAccessibleBranches";

const BAR_COLORS = ["#4F46E5", "#059669", "#F59E0B", "#EF4444", "#8B5CF6"];

const SalesOverview = () => {
  const { authUser } = useAuthContext();
  const { getBillsSummary } = useGetBillsSalesSummary();
  const { getBillItemsSummary } = useGetBillItemsSalesSummary();
  const { getAccessibleBranches } = useGetAccessibleBranches();

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(
    () => new Date(new Date().setDate(1)).toISOString().split("T")[0]
  );

  const [allBranches, setAllBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [chartMetric, setChartMetric] = useState("quantity");
  const [trendView, setTrendView] = useState("daily");
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalUnitsSold: 0,
    numberOfBills: 0,
  });
  const [allItems, setAllItems] = useState([]);
  const [allBills, setAllBills] = useState([]);
  const [hasFetchedInitially, setHasFetchedInitially] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const topItems = useMemo(() => {
    let sorted = Object.values(allItems).sort(
      (a, b) => b[chartMetric] - a[chartMetric]
    );
    return sorted.slice(0, 5);
  }, [allItems, chartMetric]);

  const fetchSalesSummary = useCallback(async () => {
    try {
      if (!authUser) return;
      setLoading(true);

      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        toast.error("The time period selected is invalid");
        return;
      }
      end.setHours(23, 59, 59, 999);

      const [billsSummary, itemsSummary] = await Promise.all([
        getBillsSummary({
          branchId: selectedBranch?.branchId || authUser.branchId,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        }),
        getBillItemsSummary({
          branchId: selectedBranch?.branchId || authUser.branchId,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        }),
      ]);
      setAllBills(billsSummary || []);
      const totalRevenue =
        billsSummary?.reduce(
          (sum, bill) => sum + parseFloat(bill.totalAmount),
          0
        ) || 0;
      const numberOfBills = billsSummary?.length || 0;
      const totalUnitsSold =
        itemsSummary?.reduce(
          (sum, item) => sum + (Number(item.purchasedQuantity) || 0),
          0
        ) || 0;

      const agg = {};
      (itemsSummary || []).forEach((item) => {
        const key = item.itemId;
        const name = item.name || key;
        const qty = Number(item.purchasedQuantity) || 0;
        const price = parseFloat(item.priceWhenBought || 0);
        const tax = parseFloat(item.taxWhenBought || 0);
        const revenue = qty * price;

        if (agg[key]) {
          agg[key].quantity += qty;
          agg[key].revenue += revenue;
        } else {
          agg[key] = {
            name,
            quantity: qty,
            revenue,
            key,
            priceWhenBought: price,
            taxWhenBought: tax,
          };
        }
      });

      setAllItems(agg);
      setSummary({
        totalRevenue,
        totalUnitsSold,
        numberOfBills,
      });
    } catch (error) {
      toast.error("Error fetching sales summary");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    authUser,
    startDate,
    endDate,
    getBillsSummary,
    getBillItemsSummary,
    selectedBranch,
  ]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branches = await getAccessibleBranches();
        setAllBranches(branches);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchBranches();
  }, [getAccessibleBranches]);

  useEffect(() => {
    if (!hasFetchedInitially) {
      fetchSalesSummary();
      setHasFetchedInitially(true);
    }
  }, [hasFetchedInitially, fetchSalesSummary]);

  const { totalRevenue, totalUnitsSold, numberOfBills } = summary;
  const averageOrderValue =
    numberOfBills > 0 ? totalRevenue / numberOfBills : 0;

  return (
    <div className="px-1 py-4 sm:p-4">
      {loading ? (
        <Spinner
          loadingMessageStyles="text-4xl font-semibold"
          loadingMessage="Generating sales summary..."
        />
      ) : (
        <>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 text-gray-800">
            Sales Overview
          </h2>

          <div className="w-full flex flex-col items-center justify-center rounded-lg mb-6 py-2 sm:px-4">
            <div className="flex items-center w-full sm:w-[250px] gap-2 justify-center bg-gray-300 py-2 px-4 rounded-2xl">
              <label
                htmlFor="branchID"
                className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap"
              >
                Branch:
              </label>
              {allBranches.length > 1 ? (
                <div className="relative w-full sm:w-[200px]">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-2 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                  >
                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                      {selectedBranch?.branchId ?? "All branches"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <ul className="absolute w-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-auto max-h-36 custom-scrollbar dark-scroll divide-y divide-gray-200 dark:divide-gray-700">
                      <li
                        key={0}
                        onClick={() => {
                          setSelectedBranch(null);
                          setIsOpen(false);
                          setHasFetchedInitially(false);
                        }}
                        className="cursor-pointer px-4 py-2 transition-all hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
                      >
                        <span className="font-semibold">All branches</span>
                      </li>
                      {allBranches.map((branch) => (
                        <li
                          key={branch.branchId}
                          onClick={() => {
                            setSelectedBranch(branch);
                            setIsOpen(false);
                            setHasFetchedInitially(false);
                          }}
                          className="cursor-pointer px-4 py-2 transition-all hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
                        >
                          <span className="font-medium">{branch.branchId}</span>{" "}
                          - {branch.location}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div>
                  <span className="font-medium">
                    {allBranches[0]?.branchId}
                  </span>{" "}
                  - {allBranches[0]?.location}
                </div>
              )}
            </div>
          </div>

          <AnalysisDatePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onRefresh={fetchSalesSummary}
            loading={loading}
          />

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={`₹${totalRevenue.toFixed(2)}`}
              />
              <StatCard title="Total Units Sold" value={totalUnitsSold} />
              <StatCard
                title="Average Order Value"
                value={`₹${averageOrderValue.toFixed(2)}`}
              />
              <StatCard title="Number of Bills" value={numberOfBills} />
            </div>

            <div
              className="bg-white p-4 rounded shadow"
              id="print-top-items-chart-section"
            >
              <div className="flex justify-between items-center mb-4 flex-col gap-y-4">
                <h4 className="text-base font-medium text-gray-700">
                  Top Selling Items (
                  {chartMetric === "quantity" ? "Units Sold" : "Revenue"})
                </h4>
                <div className="flex gap-2 items-center mb-2 sm:mb-0 flex-wrap justify-between w-full">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <button
                      className={`px-3 py-1 rounded border ${
                        chartMetric === "quantity"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700"
                      }`}
                      onClick={() => setChartMetric("quantity")}
                    >
                      Units Sold
                    </button>
                    <button
                      className={`px-3 py-1 rounded border ${
                        chartMetric === "revenue"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700"
                      }`}
                      onClick={() => setChartMetric("revenue")}
                    >
                      Revenue
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        exportTopSellingItemsToCSV(allItems, chartMetric)
                      }
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => {
                        const printContent = document.getElementById(
                          "print-top-items-chart-section"
                        ).innerHTML;
                        return handlePrint(printContent);
                      }}
                      className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Print Chart
                    </button>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topItems}
                  margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      chartMetric === "revenue" ? `₹${value.toFixed(2)}` : value
                    }
                  />
                  <Bar dataKey={chartMetric} radius={[4, 4, 0, 0]}>
                    {topItems.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className="bg-white p-4 rounded shadow"
              id="print-trends-chart-section"
            >
              <div className="flex justify-between items-center mb-4 flex-col gap-y-4">
                <h4 className="text-base font-medium text-gray-700">
                  Revenue and Bill Trends
                </h4>
                <div className="flex gap-2 items-center mb-2 sm:mb-0 flex-wrap justify-between w-full">
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportTrendsToCSV(allBills, trendView)}
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => {
                        const printContent = document.getElementById(
                          "print-trends-chart-section"
                        ).innerHTML;
                        return handlePrint(printContent);
                      }}
                      className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Print Chart
                    </button>
                  </div>
                  <div className="space-x-2">
                    {["daily", "weekly", "monthly"].map((view) => (
                      <button
                        key={view}
                        className={`px-3 py-1 rounded border capitalize ${
                          trendView === view
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                        onClick={() => setTrendView(view)}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getTrendsData(allBills, trendView)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "Revenue"
                        ? [`₹${value.toFixed(2)}`, name]
                        : [value, name]
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={false}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="bills"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={false}
                    name="Bills"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesOverview;
