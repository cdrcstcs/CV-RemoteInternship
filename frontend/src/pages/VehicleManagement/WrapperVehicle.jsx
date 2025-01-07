"use client";

import React, { useEffect } from "react";
import Navbar from "../../components/Vehicle/Navbar";
import Sidebar from "../../components/Vehicle/Sidebar";
import StoreProvider, { useAppSelector } from "../State/Redux";
import { Outlet } from "react-router-dom"; // Import Outlet for nested routes

const DashboardLayout = () => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]); // Add dependency array to avoid unnecessary re-renders

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-900 text-gray-900 w-full h-full`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-900 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {/* Render child components inside Outlet */}
        <Outlet />
      </main>
    </div>
  );
};

const WrapperVehicle = ({ children }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default WrapperVehicle;
