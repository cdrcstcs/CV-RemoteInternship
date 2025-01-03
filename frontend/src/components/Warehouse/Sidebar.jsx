import { useAppDispatch, useAppSelector } from "../../pages/Warehouse/State/Redux";
import { setIsSidebarCollapsed } from "../../pages/Warehouse/State/State";
import {
  CircleDollarSign,
  Clipboard,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Use React Router's Link and useLocation
import React from "react";

// SidebarLink Component
const SidebarLink = ({ href, icon: Icon, label, isCollapsed }) => {
  const location = useLocation(); // Use React Router's useLocation hook to get the current pathname
  const isActive = location.pathname == href;

  return (
    <Link to={href}> {/* Use React Router's Link component */}
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:text-gray-900 hover:bg-gray-900 gap-3 transition-colors ${
          isActive ? "bg-gray-900 text-white" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

// Sidebar Component
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-emerald-400 transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-gray-900"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/warehouse"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/warehouse/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/warehouse/linechart"
          icon={Clipboard}
          label="Line Chart"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2024 Edstock</p>
      </div>
    </div>
  );
};

export default Sidebar;
