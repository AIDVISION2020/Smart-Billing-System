import Navbar from "../components/navbar/Navbar";
import { PagesLink } from "../constants/constants.js";
import {
  openDatabase,
  getUnfinishedBills,
  saveCurrentBill,
} from "../indexedDB/indexedDB.js";
import { useEffect, useState } from "react";
import { ReceiptIndianRupee, ChevronDown, Search } from "lucide-react";
import Spinner from "../components/spinner/Spinner.jsx";
import UnfinishedBillCard from "../components/cards/UnfinishedBillCard.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useGetAccessibleBranches from "../hooks/useGetAccessibleBranches.js";
import { useAuthContext } from "../context/AuthContext.jsx";

const Billing = () => {
  const [allUnfinishedBills, setAllUnfinishedBills] = useState(null);
  const [updatedBillListCnt, setUpdatedBillListCnt] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortOption, setSortOption] = useState("updated");
  const [searchQuery, setSearchQuery] = useState("");
  const [accessibleBranches, setAccessibleBranches] = useState([]);
  const [showBranchesDropdown, setShowBranchesDropdown] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [areUnfinishedBillsFetched, setAreUnfinishedBillsFetched] =
    useState(false);

  const { getAccessibleBranches } = useGetAccessibleBranches();

  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchAccessibleBranches = async () => {
      const branches = await getAccessibleBranches();
      setAccessibleBranches(branches);
      if (branches.length === 1) setSelectedBranch(branches[0].branchId);
    };
    fetchAccessibleBranches();
  }, [getAccessibleBranches]);

  const sortBills = (bills, sortBy) => {
    return [...bills].sort((a, b) => {
      if (sortBy === "updated") {
        return (b.lastUpdatedAt || 0) - (a.lastUpdatedAt || 0); // Latest updated first
      } else if (sortBy === "created") {
        return (b.createdAt || 0) - (a.createdAt || 0); // Earliest created first
      } else if (sortBy === "lexicographical") {
        return a.billName.localeCompare(b.billName);
      }
      return 0;
    });
  };

  const filteredBills = allUnfinishedBills
    ? allUnfinishedBills.filter((bill) => {
        const customerMatch = bill.customerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const billNameMatch = bill.billName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        return customerMatch || billNameMatch;
      })
    : [];

  const generateBillId = () => {
    const timestamp = Date.now(); // in ms
    const base36 = timestamp.toString(36); // compact form
    return `${base36.slice(-7)}`; // total length = 2 + 7 = 9
  };

  const createNewBill = async () => {
    try {
      if (!selectedBranch) {
        toast.error("Please select a branch to create a new bill.");
        return;
      }
      const billId = generateBillId();
      const newBill = {
        customerName: "customer_" + billId,
        billId,
        billName: "bill_" + billId,
        branchId: selectedBranch,
        items: [],
        totalAmount: 0,
        subTotal: 0,
        totalTax: 0,
        status: "pending", // New field to track bill status
        createdBy: authUser._id,
      };

      await saveCurrentBill(newBill);

      toast.success("New bill created successfully!");
      navigate(`${PagesLink.BILLING_TABLE.link}/${billId}`);
    } catch (error) {
      toast.error("Error creating new bill:", error);
    }
  };

  useEffect(() => {
    const initializeIndexedDB = async () => {
      try {
        await openDatabase();
        setAllUnfinishedBills(
          await getUnfinishedBills({ createdBy: authUser.userId })
        );
        setAreUnfinishedBillsFetched(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    setAreUnfinishedBillsFetched(false);
    initializeIndexedDB();
  }, [updatedBillListCnt, authUser.userId]);

  const sortedBills = sortBills(filteredBills, sortOption);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar currentPageName={PagesLink.BILLING.name} />
      <div
        className={`flex-grow flex items-center ${
          allUnfinishedBills?.length > 0 ? "justify-start" : "justify-center"
        } p-4 flex-col`}
      >
        {areUnfinishedBillsFetched ? (
          <>
            {allUnfinishedBills.length > 0 ? (
              <div className="flex flex-col items-center gap-y-2 w-full">
                <div className="w-full flex sm:flex-row items-center justify-between gap-1 sm:gap-4 mb-6">
                  {/* Search Bar */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto flex-1">
                    <Search className="text-gray-500 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by bill/customer name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-grow w-full px-4 py-2 text-sm rounded-xl border border-gray-700 bg-gray-900 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-32 px-2 py-1 sm:px-4 sm:py-2 text-sm rounded-xl border border-gray-700 bg-gray-900 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 cursor-pointer"
                  >
                    <option value="updated">Last Updated</option>
                    <option value="created">Creation Date</option>
                    <option value="lexicographical">Name (A-Z)</option>
                  </select>
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-wide text-gray-700 dark:text-white uppercase mb-6">
                  Unfinished Bills
                </h1>
                <div className="flex flex-wrap gap-6 items-center justify-center w-full">
                  <div className="flex flex-wrap gap-6 items-center justify-center w-full">
                    {sortedBills.slice(0, visibleCount).map((bill) => (
                      <div
                        key={bill.billName}
                        className="min-w-[40%] max-w-[95%] "
                      >
                        <UnfinishedBillCard
                          bill={bill}
                          setUpdatedBillListCnt={setUpdatedBillListCnt}
                        />
                      </div>
                    ))}
                  </div>

                  {visibleCount < filteredBills.length && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 10)}
                      className="mt-6 px-6 py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition"
                    >
                      Load More
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <ReceiptIndianRupee
                  size={100}
                  className="text-gray-600 dark:text-gray-300"
                />
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    No Bill Found
                  </h1>
                  <p className="text-xl mt-1 text-gray-500 dark:text-gray-300">
                    Select a branch and start with a fresh bill
                  </p>
                </div>
              </div>
            )}
            <div className="mt-4 flex space-x-2 flex-wrap space-y-2 w-full items-center justify-center ">
              {/* Start Fresh Bill Button */}
              <div className="relative min-w-[200px]">
                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setShowBranchesDropdown(!showBranchesDropdown)}
                  className="w-full px-4 py-3 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 gap-4"
                >
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {selectedBranch ? selectedBranch : "Select a branch"}
                  </span>
                  {accessibleBranches.length > 1 && (
                    <ChevronDown
                      className={`h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform ${
                        showBranchesDropdown ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Menu */}
                {showBranchesDropdown && accessibleBranches.length > 1 && (
                  <ul className="absolute left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-auto max-h-36 custom-scrollbar dark-scroll divide-y divide-gray-200 dark:divide-gray-700">
                    {accessibleBranches.map((branch) => (
                      <li
                        key={branch.branchId}
                        onClick={() => {
                          setSelectedBranch(branch.branchId);
                          setShowBranchesDropdown(false);
                        }}
                        className="cursor-pointer px-4 py-3 transition-all hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-300 dark:hover:bg-blue-600"
                      >
                        <span className="font-medium">{branch.branchId}</span> -{" "}
                        {branch.location}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={createNewBill}
                className={`${
                  !selectedBranch && "cursor-not-allowed opacity-50"
                } px-6 py-2 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-md transition-all duration-300`}
              >
                Start a fresh bill
              </button>
            </div>
          </>
        ) : (
          <Spinner
            loadingMessageStyles="text-4xl font-semibold"
            loadingMessage="Checking for previous bills..."
          />
        )}
      </div>
    </div>
  );
};

export default Billing;
