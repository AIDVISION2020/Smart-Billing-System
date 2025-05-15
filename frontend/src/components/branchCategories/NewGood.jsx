import propTypes from "prop-types";
import { useState, useRef } from "react";
import { Check, Plus } from "lucide-react";

const NewGood = ({ newGoods, setNewGoods, selectedCategory }) => {
  const [newGood, setNewGood] = useState({
    uuid: "",
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    tax: 0,
    category: selectedCategory.name,
    measurementType: "quantity",
  });
  const [addGoodErrors, setAddGoodErrors] = useState({
    name: "",
    description: "",
  });
  const uuidInputRef = useRef(null);

  const handleAddNewGood = () => {
    let newErrors = {};
    if (newGoods.some((good) => good.name === newGood.name)) {
      newErrors.name = "Item name already exists!";
    }
    if (newGoods.some((good) => good.uuid === newGood.uuid)) {
      newErrors.uuid = "Item with uuid already exists!";
    }
    if (!newGood.uuid.trim()) newErrors.uuid = "Item uuid is required!";
    if (newGood.uuid.length < 3 || newGood.uuid.length > 6)
      newErrors.uuid = "Item uuid must be between 3 and 6 characters!";
    if (newGood.uuid.length > 0 && !/^[a-zA-Z0-9]+$/.test(newGood.uuid)) {
      newErrors.uuid = "Item uuid must be alphanumeric!";
    }

    if (
      newGood.measurementType !== "quantity" &&
      newGood.measurementType !== "weight"
    )
      newErrors.measurementType =
        "Measurement type must be either quantity or weight!";
    if (!newGood.name.trim()) newErrors.name = "Item name is required!";
    if (!newGood.description.trim())
      newErrors.description = "Description cannot be empty!";
    if (newGood.quantity < 1)
      newErrors.quantity = "Quantity cannot be less than 1!";
    if (!Number.isInteger(Number(newGood.quantity)))
      newErrors.quantity = "Quantity must be an integer!";

    if (newGood.price < 0) newErrors.price = "Price cannot be less than 0!";
    if (newGood.tax < 0 || newGood.tax > 100)
      newErrors.tax = "Tax must be between 0 and 100!";

    if (Object.keys(newErrors).length > 0) {
      setAddGoodErrors(newErrors); // Show addGoodErrors
      return;
    }

    setAddGoodErrors({});
    setNewGoods([...newGoods, newGood]),
      setNewGood((prev) => ({
        ...prev,
        uuid: "",
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        tax: 0,
        category: selectedCategory.name,
      }));

    // Focus the next item name input after state updates
    setTimeout(() => {
      uuidInputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-center mt-12 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 text-xl sm:text-3xl font-extrabold uppercase">
          <Plus size={36} strokeWidth={2.5} className="text-white" />
          <span className="flex flex-wrap items-center gap-2">
            Add Goods To
            <span className="text-yellow-300 underline decoration-2 decoration-dotted">
              {selectedCategory.name}
            </span>
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-sm uppercase bg-gray-200 dark:bg-gray-900 dark:text-gray-400 font-bold">
            <tr>
              {[
                "Item UUID",
                "Item Name",
                "Description",
                "Measurement Type",
                "Price",
                "Quantity / Weight(Kg)",
                "Tax (%)",
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
            {newGoods.map((good, index) => (
              <tr
                key={index}
                className={`border-b dark:border-gray-700 ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all`}
              >
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {good.uuid}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {good.name}
                </td>
                <td className="px-6 py-4 font-semibold">{good.description}</td>
                <td className={`font-semibold text-white `}>
                  <span
                    className={`px-4 py-2 ${
                      good.measurementType === "weight"
                        ? "bg-blue-600"
                        : "bg-green-600"
                    }`}
                  >
                    {good.measurementType}
                  </span>
                </td>
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
              </tr>
            ))}
            <tr className="border-b dark:border-gray-700 bg-white dark:bg-gray-900">
              <td className="px-6 py-4">
                <input
                  ref={uuidInputRef}
                  type="text"
                  placeholder="Item Id"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    addGoodErrors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-400"
                  }`}
                  value={newGood.uuid}
                  required={true}
                  minLength={3}
                  maxLength={6}
                  onChange={(e) =>
                    setNewGood({ ...newGood, uuid: e.target.value })
                  }
                />
                {addGoodErrors.uuid && (
                  <p className="text-red-500 text-xs mt-1">
                    {addGoodErrors.uuid}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    addGoodErrors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-400"
                  }`}
                  value={newGood.name}
                  required={true}
                  minLength={3}
                  maxLength={50}
                  onChange={(e) =>
                    setNewGood({ ...newGood, name: e.target.value })
                  }
                />
                {addGoodErrors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {addGoodErrors.name}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  placeholder="Description"
                  required={true}
                  minLength={3}
                  maxLength={50}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    addGoodErrors.description
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-400"
                  }`}
                  value={newGood.description}
                  onChange={(e) =>
                    setNewGood({ ...newGood, description: e.target.value })
                  }
                />
                {addGoodErrors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {addGoodErrors.description}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <select
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 border-gray-200 focus:ring-blue-400"
                  value={newGood.measurementType || "quantity"}
                  onChange={(e) =>
                    setNewGood({
                      ...newGood,
                      measurementType: e.target.value.toLowerCase(),
                    })
                  }
                >
                  <option value="quantity">Quantity</option>
                  <option value="weight">Weight</option>
                </select>
                {addGoodErrors.measurementType && (
                  <p className="text-red-500 text-xs mt-1">
                    {addGoodErrors.measurementType}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  placeholder="Price"
                  min={0}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    addGoodErrors.price
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-400"
                  }`}
                  value={newGood.price}
                  onChange={(e) =>
                    setNewGood({ ...newGood, price: e.target.value })
                  }
                />
                {addGoodErrors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {addGoodErrors.price}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  placeholder="Quantity"
                  min={1}
                  max={999999999}
                  required={true}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    addGoodErrors.quantity
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-400"
                  }`}
                  value={newGood.quantity}
                  onChange={(e) =>
                    setNewGood({ ...newGood, quantity: e.target.value })
                  }
                />
                {addGoodErrors.quantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {addGoodErrors.quantity}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  placeholder="Tax (%)"
                  min={0}
                  max={100}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    addGoodErrors.tax
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-400"
                  }`}
                  value={newGood.tax}
                  onChange={(e) =>
                    setNewGood({ ...newGood, tax: e.target.value })
                  }
                />
                {addGoodErrors.tax && (
                  <p className="text-red-500 text-xs mt-1">
                    {addGoodErrors.tax}
                  </p>
                )}
              </td>
              <td>
                <button
                  className={`px-4 py-2 rounded-lg transition-all ${
                    newGood.name.trim() &&
                    newGood.description.trim() &&
                    newGood.quantity > 0 &&
                    newGood.price > 0 &&
                    newGood.tax >= 0 &&
                    newGood.tax <= 100 &&
                    Number.isInteger(Number(newGood.quantity))
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                  onClick={() => handleAddNewGood()}
                >
                  <Check size={17} strokeWidth={2.5} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

NewGood.propTypes = {
  newGoods: propTypes.array.isRequired,
  setNewGoods: propTypes.func.isRequired,
  selectedCategory: propTypes.object.isRequired,
};

export default NewGood;
