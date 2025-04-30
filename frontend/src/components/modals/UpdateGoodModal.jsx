import { useState } from "react";
import useModifyGood from "@/hooks/useModifyGood";
import Spinner from "@/components/spinner/Spinner";
import { X as Close, Save, Replace, ImagePlus } from "lucide-react";
import propTypes from "prop-types";
import { Cloudinary } from "../../constants/constants";
import toast from "react-hot-toast";

const UpdateGoodModal = ({
  showModal,
  setShowModal,
  setGoodListChangedCnt,
  branchId,
  currGood,
  categoryName,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updatedGood, setUpdatedGood] = useState({
    name: currGood.name || "",
    description: currGood.description || "",
    price: currGood.price || 0,
    quantity: currGood.quantity || 1,
    tax: currGood.tax || 0,
    itemId: currGood.itemId,
  });
  const { loading, modifyGood } = useModifyGood();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    if (file.type === "image/heic" || file.name.endsWith(".heic")) {
      toast.error("HEIC images are not supported. Please upload JPG or PNG.");
      return;
    }
    if (file.size > 10485760) {
      toast.error(
        "The image size exceeds 1 MB. Please upload a smaller image."
      );
      return;
    }
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", Cloudinary.UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${Cloudinary.CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error?.message || "Image upload failed");

      return data.secure_url;
    } finally {
      setImageUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedGood((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in updatedGood) {
      if (typeof updatedGood[key] === "string") {
        updatedGood[key] = updatedGood[key].trim();
      }
    }

    const updateFlow = async () => {
      let imageUrl = currGood.imageUrl;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }
      await modifyGood({ branchId, good: { ...updatedGood, imageUrl } });

      setPreviewImage(null);
      setImageFile(null);
      setShowModal(false);
      setGoodListChangedCnt((prev) => prev + 1);
    };
    toast.promise(updateFlow, {
      loading: "Updating Item...",
    });
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="p-4 w-full max-w-md max-h-[90%] overflow-y-auto custom-scrollbar dark-scroll">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform transition-all duration-300 ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Good
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white p-2 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              <Close className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="flex border-2 border-gray-300 justify-between items-center py-4 px-6 rounded-lg flex-wrap">
              <div>
                <span className="text-gray-800 dark:text-gray-400 font-bold">
                  BranchId :{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-400 font-semibold">
                  {branchId}
                </span>
              </div>
              <div>
                <span className="text-gray-800 dark:text-gray-400 font-bold">
                  Category :{" "}
                </span>
                <span className="text-gray-800 dark:text-gray-400 font-semibold">
                  {categoryName}
                </span>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({ ...updatedGood, name: currGood.name })
                  }
                />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                minLength={3}
                maxLength={50}
                value={updatedGood.name}
                onChange={handleChange}
              />
            </div>

            {/* Description Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({
                      ...updatedGood,
                      description: currGood.description,
                    })
                  }
                />
              </div>
              <textarea
                name="description"
                id="description"
                className="text-md w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-none h-24 custom-scrollbar dark-scroll"
                placeholder="Enter description..."
                required
                minLength={3}
                maxLength={50}
                value={updatedGood.description}
                onChange={handleChange}
              />
            </div>

            {/* Modern Image Upload */}
            <div className="w-full flex flex-col items-center justify-center">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2 text-start w-full">
                Item Image
              </label>

              <div className="relative rounded-xl cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />

                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 transition-colors p-1">
                  {previewImage || currGood.imageUrl ? (
                    <>
                      {/* Skeleton placeholder while image loads */}
                      {imageLoading && !previewImage && (
                        <div className="w-[256px] h-40 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700" />
                      )}

                      {/* Actual image */}
                      <img
                        src={previewImage || currGood.imageUrl}
                        alt="Preview"
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                        className={`max-w-[256px] h-40 object-contain rounded-lg transition-opacity duration-300 ${
                          imageLoading ? "opacity-0 absolute" : "opacity-100"
                        }`}
                      />
                    </>
                  ) : (
                    <div className="w-[256px] h-40 flex flex-col items-center justify-center space-y-2">
                      <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-2">
                        Click or drag to upload a new image (max 1MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({ ...updatedGood, price: currGood.price })
                  }
                />
              </div>
              <input
                type="number"
                name="price"
                id="price"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min={0}
                step="0.01"
                value={updatedGood.price}
                onChange={handleChange}
              />
            </div>

            {/* Quantity Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Quantity
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({
                      ...updatedGood,
                      quantity: currGood.quantity,
                    })
                  }
                />
              </div>
              <input
                type="number"
                name="quantity"
                id="quantity"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min={1}
                max={999999999}
                value={updatedGood.quantity}
                onChange={handleChange}
              />
            </div>

            {/* Tax Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="tax"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tax (%)
                </label>
                <Replace
                  size={20}
                  className="text-blue-600 cursor-pointer"
                  onClick={() =>
                    setUpdatedGood({ ...updatedGood, tax: currGood.tax })
                  }
                />
              </div>
              <input
                type="number"
                name="tax"
                id="tax"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min={0}
                max={100}
                step={0.01}
                value={updatedGood.tax}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading || imageUploading}
              type="submit"
              className={`w-full flex items-center justify-center px-5 py-3 rounded-lg shadow-lg transition-all duration-300 
                ${
                  loading || imageUploading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:focus:ring-blue-500"
                }
              `}
            >
              {loading || imageUploading ? (
                <Spinner dotStyles="bg-white h-3 w-3" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Good
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

UpdateGoodModal.propTypes = {
  showModal: propTypes.bool.isRequired,
  setShowModal: propTypes.func.isRequired,
  setGoodListChangedCnt: propTypes.func.isRequired,
  branchId: propTypes.string.isRequired,
  currGood: propTypes.object.isRequired,
  categoryName: propTypes.string.isRequired,
};

export default UpdateGoodModal;
