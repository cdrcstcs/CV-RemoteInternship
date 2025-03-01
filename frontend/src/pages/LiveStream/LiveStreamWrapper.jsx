import React, { useEffect, useState } from "react";
import Navbar from "../../components/LiveStream/Navbar";
import Sidebar from "../../components/LiveStream/Sidebar";
import { useAppSelector } from "../State/Redux";
import { StreamPlayer } from "./StreamPlayer";
import StoreProvider from "../State/Redux";
const DashboardLayout = () => {
  const [selectedStream, setSelectedStream] = useState(null); // State to hold the selected stream
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

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream); // Set the selected stream when a stream is clicked
  };

  return (
      <div
        className={`${
          isDarkMode ? "dark" : "light"
        } flex bg-gray-900 text-gray-900 w-full h-full`}
      >
        <Sidebar onStreamSelect={handleStreamSelect} /> {/* Pass down the handler to Sidebar */}
        <main
          className={`flex flex-col w-full h-full py-7 px-9 bg-gray-900 ${
            isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
          }`}
        >
          <Navbar />
          {/* Conditionally render StreamPlayer if a stream is selected */}
          {selectedStream ? (
            <StreamPlayer user={selectedStream.user} stream={selectedStream} isFollowing />
          ) : (
            <div className="text-white text-center">Select a stream to watch</div>
          )}
        </main>
      </div>
  );
};


const LiveStreamWrapper = ({ children }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};
export default LiveStreamWrapper;
