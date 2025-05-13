import AllBranches from "../components/allBranches/AllBranches.jsx";
import SelectedBranch from "../components/selectedBranch/SelectedBranch.jsx";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar.jsx";
import { PagesLink, AppNameAcronym } from "../constants/constants.js";

const ManageGoods = () => {
  useEffect(() => {
    document.title = `${AppNameAcronym} | Manage Goods`;
  }, []);
  const [selectedBranch, setSelectedBranch] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar currentPageName={PagesLink.MANAGE_GOODS.name} />
      <AllBranches
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
      />
      {selectedBranch && (
        <SelectedBranch selectedBranch={selectedBranch} key={selectedBranch} />
      )}
    </div>
  );
};

export default ManageGoods;
