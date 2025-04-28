import propTypes from "prop-types";
import CurrentBillTable from "../table/CurrentBillTable";
import BillCheckout from "./BillCheckout";

const CurrentBill = ({ currentBill, setCurrentBill }) => {
  return (
    <>
      {currentBill.items.length > 0 ? (
        <>
          <span className="text-gray-900 text-xl font-bold">Current Bill</span>
          <div className="flex flex-col  overflow-x-auto ">
            <CurrentBillTable
              currentBill={currentBill}
              setCurrentBill={setCurrentBill}
            />
          </div>
          <BillCheckout
            currentBill={currentBill}
            setCurrentBill={setCurrentBill}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300">
          <p className="text-lg">No items in the bill</p>
        </div>
      )}
    </>
  );
};

CurrentBill.propTypes = {
  currentBill: propTypes.object.isRequired,
  setCurrentBill: propTypes.func.isRequired,
};

export default CurrentBill;
