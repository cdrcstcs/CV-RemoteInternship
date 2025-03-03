import React, { useState } from "react";
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

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
  };

  const handleCreateStreamClick = () => {
    setIsCreateStreamVisible(true); // Show the stream creation form when the button is clicked
  };

  return (
    <div
      className="flex w-full h-screen text-emerald-400 bg-transparent border-2 border-white"
    >
      <Sidebar onStreamSelect={handleStreamSelect} onCreateStreamClick={handleCreateStreamClick} />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        } text-emerald-400 bg-transparent border-2 border-white`}
      >
        <Navbar />
        {/* Conditionally render StreamPlayer or StreamCreationForm */}
        {isCreateStreamVisible ? (
          <StreamCreationForm />
        ) : selectedStream ? (
          <StreamPlayer user={selectedStream.user} stream={selectedStream} isFollowing={true} />
        ) : (
          <div className="text-emerald-400 text-center">Select a stream to watch</div>
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
