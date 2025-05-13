import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { PagesLink, AppNameAcronym } from "../constants/constants";

const PageNotFound = () => {
  useEffect(() => {
    document.title = `${AppNameAcronym} | Page Not Found`;
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4 text-center">
        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-2xl max-w-md w-full">
          <span className="text-6xl font-extrabold capitalize text-slate-800 dark:text-white mb-6">
            404
          </span>
          <p className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            to={PagesLink.LANDING.link}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
