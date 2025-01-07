import React from "react";
import { useAppDispatch, useAppSelector } from "../../pages/State/Redux";
import { setIsSidebarCollapsed } from "../../pages/State/State";
import { Menu } from "lucide-react";
const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-emerald-400 rounded-full hover:bg-emerald-200"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
