import Navbar from "../components/navbar/Navbar.jsx";
import {
  PagesLink,
  AnalyticsTypes,
  AppNameAcronym,
} from "../constants/constants.js";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import SalesOverview from "../components/Analytics/Sales/SalesOverview.jsx";
import ItemsOverview from "../components/Analytics/Items/ItemsOverview.jsx";
import StockInsights from "../components/Analytics/Stock/StockInsights.jsx";

const Analytics = () => {
  useEffect(() => {
    document.title = `${AppNameAcronym} | Analytics`;
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAnalyticsType, setSelectedAnalyticsType] = useState(null);

  // Map analytics titles to components
  const componentMap = {
    "Sales Summary": <SalesOverview />,
    "Item Breakdown": <ItemsOverview />,
    "Stock Insights": <StockInsights />,
  };

  const SelectedComponent = componentMap[selectedAnalyticsType] || null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar currentPageName={PagesLink.ANALYTICS.name} />

      {/* Hamburger and Mobile Sidebar */}
      <div className="md:hidden relative">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-xl font-bold">Analytics</h2>
        </div>

        {sidebarOpen && (
          <div className="absolute top-16 left-4 right-4 bg-gray-900 z-50 rounded-2xl shadow-lg">
            <div className="flex flex-col space-y-2 p-3">
              {AnalyticsTypes.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedAnalyticsType(item.title);
                    setSidebarOpen(false);
                  }}
                  className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex p-2 sm:p-4 items-start justify-center">
        {/* Left Sidebar (Desktop only) */}
        <div className="hidden md:flex flex-col bg-gray-800 rounded-2xl py-2 overflow-y-auto w-1/4 mr-2">
          {AnalyticsTypes.map((item, index) => (
            <div
              key={index}
              className={`px-3 py-2 m-2 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                selectedAnalyticsType === item.title
                  ? "ring-2 ring-indigo-500 bg-indigo-100 dark:bg-gray-600"
                  : "bg-white dark:bg-gray-700"
              }`}
              onClick={() => setSelectedAnalyticsType(item.title)}
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Dashboard Section */}
        <div className="flex-1 flex flex-col items-start bg-gray-200 dark:bg-gray-800 p-1 rounded-2xl shadow-md min-h-full w-full overflow-y-auto">
          {SelectedComponent ? (
            <div className="w-full h-full flex-1 flex items-center justify-center rounded-2xl">
              {SelectedComponent}
            </div>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center h-full w-full">
              <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Select an analytics type to view detailed insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
