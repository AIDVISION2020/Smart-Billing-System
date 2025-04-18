import { useState } from "react";
import useUpdateCategory from "../../hooks/useUpdateCategory";
import Spinner from "@/components/spinner/Spinner";
import { X as Close, Save, ImagePlus, Replace } from "lucide-react";
import propTypes from "prop-types";
import toast from "react-hot-toast";
import { Cloudinary } from "../../constants/constants";

const UpdateCategoryModal = ({
  setShowModal,
  currCategory,
  setCategoryListChangedCnt,
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const [updatedCategory, setUpdatedCategory] = useState({
    ...currCategory,
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { loading, updateCategory } = useUpdateCategory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCategory((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateFlow = (async () => {
      let imageUrl = currCategory.imageUrl;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      await updateCategory({
        category: { ...updatedCategory, imageUrl },
      });

      setUpdatedCategory({ name: "", imageUrl: "" });
      setImageFile(null);
      setPreviewImage(null);
      setShowModal(false);
      setCategoryListChangedCnt((prev) => prev + 1);
    })();

    toast.promise(updateFlow, {
      loading: "Updating category...",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 opacity-100 overflow-y-auto
      "
    >
      <div className="p-4 w-full max-w-md max-h-screen overflow-auto">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform transition-all duration-300
            opacity-100
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Category
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white p-2 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              <Close className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <Replace
                  size={18}
                  className="text-blue-600 cursor-pointer"
                  onClick={() => {
                    setUpdatedCategory((prev) => ({
                      ...prev,
                      name: currCategory.name,
                    }));
                  }}
                />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                placeholder={`Current: ${currCategory.name}`}
                className="w-full mt-2 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                minLength={1}
                maxLength={20}
                value={updatedCategory.name}
                onChange={handleChange}
              />
            </div>

            {/* Modern Image Upload */}
            <div className="w-full flex flex-col items-center justify-center">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2 text-start w-full">
                Category Image
              </label>

              <div className="relative rounded-xl cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />

                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 transition-colors p-1">
                  {previewImage || currCategory.imageUrl ? (
                    <>
                      {/* Skeleton placeholder while image loads */}
                      {imageLoading && !previewImage && (
                        <div className="w-[256px] h-40 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700" />
                      )}

                      {/* Actual image */}
                      <img
                        src={previewImage || currCategory.imageUrl}
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

            <button
              type="submit"
              disabled={loading || imageUploading}
              className={`w-full flex items-center justify-center px-5 py-3 text-white rounded-lg shadow-lg focus:ring-4
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
                  Update Category
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

UpdateCategoryModal.propTypes = {
  setShowModal: propTypes.func.isRequired,
  currCategory: propTypes.object.isRequired,
  setCategoryListChangedCnt: propTypes.func.isRequired,
};

export default UpdateCategoryModal;
