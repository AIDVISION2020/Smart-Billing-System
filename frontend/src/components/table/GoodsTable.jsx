import propTypes from "prop-types";
import UpdateGoodModal from "../modals/UpdateGoodModal";
import { useState } from "react";
import { Pencil } from "lucide-react";

const GoodsTable = ({
  goods,
  showEditGoodOption,
  setGoodListChangedCnt,
  branchId,
  categoryName,
}) => {
  const findLastUpdate = (lastUpdate) => {
    const date = new Date(lastUpdate);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedDate;
  };
  const [openUpdGoodModal, setOpenUpdGoodModal] = useState(false);
  const [currGood, setCurrGood] = useState({});

  return (
    <>
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-sm uppercase bg-gray-200 dark:bg-gray-900 dark:text-gray-400 font-bold">
            <tr>
              {[
                "Item ID",
                "Item Name",
                "Description",
                "Price",
                "Quantity",
                "Tax (%)",
                "Last Update",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-4 tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {goods.map((good, index) => (
              <tr
                key={good.itemId}
                className={`border-b dark:border-gray-700 ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all`}
              >
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {good.itemId}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {good.name}
                </td>
                <td className="px-6 py-4 font-semibold">{good.description}</td>
                <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                  ₹{good.price}
                </td>
                <td
                  className={`px-6 py-4  font-semibold ${
                    good.quantity < 100 && "text-red-600"
                  }`}
                >
                  {good.quantity}
                </td>
                <td className="px-6 py-4 font-semibold">{good.tax}%</td>
                <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">
                  {findLastUpdate(good.updatedAt)}
                </td>
                {showEditGoodOption && (
                  <td className="px-6 py-4 font-semibold hove">
                    <Pencil
                      size={20}
                      className="text-blue-600 cursor-pointer"
                      onClick={() => {
                        setOpenUpdGoodModal(true), setCurrGood(good);
                      }}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {openUpdGoodModal && (
          <UpdateGoodModal
            categoryName={categoryName}
            showModal={openUpdGoodModal}
            setShowModal={setOpenUpdGoodModal}
            setGoodListChangedCnt={setGoodListChangedCnt}
            branchId={branchId}
            currGood={currGood}
          />
        )}
      </div>
    </>
  );
};

GoodsTable.propTypes = {
  goods: propTypes.array.isRequired,
  showEditGoodOption: propTypes.func.isRequired,
  setGoodListChangedCnt: propTypes.func.isRequired,
  branchId: propTypes.string.isRequired,
  categoryName: propTypes.string.isRequired,
};

export default GoodsTable;
