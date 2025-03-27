import propTypes from "prop-types";

const GoodsTable = ({ goods }) => {
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

GoodsTable.propTypes = {
  goods: propTypes.array.isRequired,
};

export default GoodsTable;
