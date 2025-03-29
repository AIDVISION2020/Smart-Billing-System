import PropTypes from "prop-types";
import { useState } from "react";
import { X as Close, CircleAlert } from "lucide-react";

const ConfirmModal = ({
  confirmMessage,
  yesMessage,
  noMessage,
  toggalModalMessage,
  setResponse,
  negativeElement,
}) => {
  const [open, setOpen] = useState(false);

  const toggleButtonStyle = negativeElement
    ? "block px-4 py-2 text-sm font-semibold bg-red-600 rounded-lg hover:bg-red-700 text-white cursor-pointer text-center"
    : "block px-4 py-2 text-sm font-semibold text-red-500 cursor-pointer text-center";

  return (
    <>
      {/* Open Modal Button */}
      <div onClick={() => setOpen(!open)} className={toggleButtonStyle}>
        {toggalModalMessage}
      </div>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md">
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <Close size={20} />
            </button>

            {/* Alert Icon */}
            <CircleAlert className="mx-auto mb-4 text-gray-500 w-12 h-12" />

            {/* Confirmation Message */}
            <h3 className="mb-5 text-lg font-medium text-gray-800 dark:text-gray-300">
              {confirmMessage}
            </h3>

            {/* Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all"
                onClick={() => {
                  setResponse(true);
                  setOpen(false);
                }}
              >
                {yesMessage}
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow-md transition-all"
                onClick={() => {
                  setResponse(false);
                  setOpen(false);
                }}
              >
                {noMessage}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// PropTypes Validation
ConfirmModal.propTypes = {
  confirmMessage: PropTypes.string.isRequired,
  yesMessage: PropTypes.string.isRequired,
  noMessage: PropTypes.string.isRequired,
  toggalModalMessage: PropTypes.string.isRequired,
  setResponse: PropTypes.func.isRequired,
  negativeElement: PropTypes.bool,
};

export default ConfirmModal;
