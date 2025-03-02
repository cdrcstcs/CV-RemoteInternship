import React, { useEffect, useState } from "react";
import Navbar from "../../components/LiveStream/Navbar";
import Sidebar from "../../components/LiveStream/Sidebar";
import { useAppSelector } from "../State/Redux";
import { StreamPlayer } from "./StreamPlayer";
import StoreProvider from "../State/Redux";
import StreamCreationForm from "./StreamCreationForm";
const DashboardLayout = () => {
  const [selectedStream, setSelectedStream] = useState(null);
  const [isCreateStreamVisible, setIsCreateStreamVisible] = useState(false); // State to control the visibility of the Stream Creation form

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
  }, [isDarkMode]);

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
  };

  const handleCreateStreamClick = () => {
    setIsCreateStreamVisible(true); // Show the stream creation form when the button is clicked
  };

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-900 text-gray-900 w-full h-screen`}
    >
      <Sidebar onStreamSelect={handleStreamSelect} onCreateStreamClick={handleCreateStreamClick} />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-900 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {/* Conditionally render StreamPlayer or StreamCreationForm */}
        {isCreateStreamVisible ? (
          <StreamCreationForm />
        ) : selectedStream ? (
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
