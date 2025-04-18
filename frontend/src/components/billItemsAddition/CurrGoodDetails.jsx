import propTypes from "prop-types";

const CurrGoodDetails = ({ currGood, image, setCurrGood }) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <span className="text-gray-900 text-xl font-bold">Detected item</span>
        <div className="flex items-center space-x-4">
          <img
            src={image}
            alt="Thumbnail"
            className="w-12 h-12 rounded-xl p-2 object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {currGood.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              ₹{currGood.price}
            </p>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Quantity
        </label>
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden dark:bg-gray-700 bg-white">
          <input
            type="number"
            min={1}
            max={currGood.maxQuantity}
            value={currGood.quantity}
            onChange={(e) =>
              setCurrGood({ ...currGood, quantity: Number(e.target.value) })
            }
            className="flex-grow p-2 dark:bg-gray-700 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="px-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-600">
            / {currGood.maxQuantity}
          </span>
        </div>
      </div>
    </>
  );
};

CurrGoodDetails.propTypes = {
  currGood: propTypes.object.isRequired,
  setCurrGood: propTypes.func.isRequired,
  image: propTypes.string.isRequired,
};

export default CurrGoodDetails;
