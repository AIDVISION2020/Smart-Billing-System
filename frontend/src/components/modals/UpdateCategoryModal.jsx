import { useState } from "react";
import useUpdateCategory from "../../hooks/useUpdateCategory";
import Spinner from "@/components/spinner/Spinner";
import { X as Close, Save, Replace } from "lucide-react";
import propTypes from "prop-types";
import toast from "react-hot-toast";

const UpdateCategoryModal = ({
  setShowModal,
  currCategory,
  setCategoryListChangedCnt,
}) => {
  const [updatedCategory, setUpdatedCategory] = useState({
    ...currCategory,
  });
  const { loading, updateCategory } = useUpdateCategory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCategory((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  //   const file = e.target.files[0];
  //   if (!file) return;
  //   if (!file.type.startsWith("image/")) {
  //     toast.error("Please upload a valid image file");
  //     return;
  //   }
  //   if (file.type === "image/heic" || file.name.endsWith(".heic")) {
  //     toast.error("HEIC images are not supported. Please upload JPG or PNG.");
  //     return;
  //   }
  //   if (file.size > 10485760) {
  //     toast.error(
  //       "The image size exceeds 1 MB. Please upload a smaller image."
  //     );
  //     return;
  //   }
  //   if (file) {
  //     setImageFile(file);
  //     setPreviewImage(URL.createObjectURL(file));
  //   }
  // };

  // const uploadToCloudinary = async (file) => {
  //   setImageUploading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", Cloudinary.UPLOAD_PRESET);

  //     const res = await fetch(
  //       `https://api.cloudinary.com/v1_1/${Cloudinary.CLOUD_NAME}/image/upload`,
  //       { method: "POST", body: formData }
  //     );
  //     const data = await res.json();
  //     if (!res.ok)
  //       throw new Error(data.error?.message || "Image upload failed");

  //     return data.secure_url;
  //   } finally {
  //     setImageUploading(false);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    const update = async () => {
      try {
        await updateCategory({
          category: { ...updatedCategory },
        });

        setShowModal(false);
        setCategoryListChangedCnt((prev) => prev + 1);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Update failed!");
      }
    };
    update();
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center px-5 py-3 text-white rounded-lg shadow-lg focus:ring-4
    ${
      loading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:focus:ring-blue-500"
    }
  `}
            >
              {loading ? (
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
