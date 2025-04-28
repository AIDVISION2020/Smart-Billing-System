import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar.jsx";
import { PagesLink } from "../constants/constants.js";
import { useAuthContext } from "../context/authContext.jsx";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  const { authUser } = useAuthContext();

  // Check if pageslink.roles array has the user role
  const hasAccess = (page) => {
    return page.Roles ? page.Roles.includes(authUser?.role) : false;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Navbar */}
      <Navbar currentPageName={PagesLink.LANDING.name} />

      {/* Welcome Message */}
      <div className="text-center sm:text-left px-6 py-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
          Welcome,&nbsp;
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            {authUser.name}
          </span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4 text-center">
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
          Where would you like to go today?
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {/* Card 1 */}
          {hasAccess(PagesLink.MANAGE_USERS) && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-72 flex flex-col items-start text-left transition-transform hover:scale-105">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Manage Users
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Add or update Admins, Branch Admins, or Billers.
              </p>
              <Link
                to={PagesLink.MANAGE_USERS.link}
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
              >
                Manage Users <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* Card 2 */}
          {hasAccess(PagesLink.MANAGE_GOODS) && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-72 flex flex-col items-start text-left transition-transform hover:scale-105">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Categories & Goods
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Organize inventory by editing categories and goods.
              </p>
              <Link
                to={PagesLink.MANAGE_GOODS.link}
                className="inline-flex items-center gap-1 text-pink-600 hover:underline font-semibold"
              >
                Manage Items <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* Card 3 */}
          {hasAccess(PagesLink.BILLING) && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-72 flex flex-col items-start text-left transition-transform hover:scale-105">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Perform Billing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Create invoices, manage transactions, and streamline your
                billing process efficiently.
              </p>
              <Link
                to={PagesLink.BILLING.link}
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
              >
                Start Billing <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* Card 4 */}
          {hasAccess(PagesLink.ANALYTICS) && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-72 flex flex-col items-start text-left transition-transform hover:scale-105">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                View Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Explore sales trends, top-performing items, and key metrics to
                drive smarter decisions.
              </p>
              <Link
                to={PagesLink.ANALYTICS.link}
                className="inline-flex items-center gap-1 text-pink-600 hover:underline font-semibold"
              >
                Go to Analytics <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
