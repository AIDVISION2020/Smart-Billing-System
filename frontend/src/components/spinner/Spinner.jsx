import PropTypes from "prop-types";

const Spinner = ({
  extraStyles,
  loadingMessage,
  loadingMessageStyles,
  dotStyles,
}) => {
  return (
    <div
      className={`flex inset-0 space-x-2 justify-center items-center w-full h-full ${extraStyles}`}
    >
      {loadingMessage ? (
        <div
          className={`animate-bounce text-lg font-bold ${loadingMessageStyles} `}
        >
          {loadingMessage}
        </div>
      ) : (
        <>
          <div
            className={`h-3 w-3 rounded-full animate-bounce [animation-delay:-0.3s] ${dotStyles}`}
          ></div>
          <div
            className={`h-3 w-3 rounded-full animate-bounce [animation-delay:-0.15s] ${dotStyles}`}
          ></div>
          <div
            className={`h-3 w-3 rounded-full animate-bounce ${dotStyles}`}
          ></div>
        </>
      )}
    </div>
  );
};

Spinner.propTypes = {
  extraStyles: PropTypes.string,
  loadingMessage: PropTypes.string,
  loadingMessageStyles: PropTypes.string,
  dotStyles: PropTypes.string,
};

export default Spinner;
