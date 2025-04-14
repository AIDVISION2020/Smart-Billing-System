import Navbar from "../components/navbar/Navbar";
import { PagesLink } from "../constants/constants.js";
import { openDatabase, getUnfinishedBills } from "../indexedDB/indexedDB.js";
import { useEffect, useState } from "react";
import { ReceiptIndianRupee } from "lucide-react";
import Spinner from "../components/spinner/Spinner.jsx";
import UnfinishedBillCard from "../components/cards/UnfinishedBillCard.jsx";

const Billing = () => {
  const [allUnfinishedBills, setAllUnfinishedBills] = useState(null);
  const [updatedBillListCnt, setUpdatedBillListCnt] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  const [areUnfinishedBillsFetched, setAreUnfinishedBillsFetched] =
    useState(false);

  useEffect(() => {
    const initializeIndexedDB = async () => {
      try {
        await openDatabase();
        setAllUnfinishedBills(await getUnfinishedBills());
        setAreUnfinishedBillsFetched(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    setAreUnfinishedBillsFetched(false);
    initializeIndexedDB();
  }, [updatedBillListCnt]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar currentPageName={PagesLink.BILLING.name} />

      <div className="flex-grow flex items-center justify-center p-4 flex-col">
        {areUnfinishedBillsFetched ? (
          <>
            {allUnfinishedBills.length > 0 ? (
              <div className="flex flex-col items-center gap-y-2">
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-wide text-gray-700 dark:text-white uppercase mb-6">
                  Stored Bills
                </h1>
                <div className="flex flex-wrap gap-6 items-center justify-center ">
                  <div className="flex flex-wrap gap-6 items-center justify-center">
                    {allUnfinishedBills.slice(0, visibleCount).map((bill) => (
                      <div key={bill.billName} className="max-w-[95%]">
                        <UnfinishedBillCard
                          bill={bill}
                          setUpdatedBillListCnt={setUpdatedBillListCnt}
                        />
                      </div>
                    ))}
                  </div>

                  {visibleCount < allUnfinishedBills.length && (
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
                    Start a new transaction to create a bill.
                  </p>
                </div>
              </div>
            )}
            <div className="mt-4">
              {/* Start Fresh Bill Button */}
              <button
                className="px-6 py-2 mt-4 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-md transition-all duration-300"
                onClick={() => {
                  /* Handle start fresh bill action */
                }}
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
        {/* } */}
      </div>
    </div>
  );
};

export default Billing;
