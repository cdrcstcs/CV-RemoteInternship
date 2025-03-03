import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../pages/State/Redux";
import { setIsSidebarCollapsed } from "../../pages/State/State";
import { Menu } from "lucide-react";
import useLiveStreamStore from "../../stores/useLiveStreamStore";

const Sidebar = ({ onStreamSelect, onCreateStreamClick }) => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const { streams, getStreams } = useLiveStreamStore();

  useEffect(() => {
    getStreams();
  }, [getStreams]);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // Class names with transparent background and white border
  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-transparent border-2 border-white transition-all duration-300 overflow-hidden h-full z-40`;

  const handleStreamClick = (stream) => {
    onStreamSelect(stream);
  };

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

      {/* Create Stream Button */}
      <div className={`mt-6 ${isSidebarCollapsed ? "hidden" : "block"} px-4`}>
        <button
          className="w-full bg-emerald-400 text-white py-2 rounded-md"
          onClick={onCreateStreamClick}
        >
          Create Stream
        </button>
      </div>

      {/* Stream List Section */}
      <div className={`mt-6 ${isSidebarCollapsed ? "hidden" : "block"} overflow-y-auto`}>
        <h3 className="text-white font-bold text-lg mb-4 px-4">Active Streams</h3>
        {streams && streams.length > 0 ? (
          <ul className="space-y-3 px-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            {streams.map((stream) => (
              <li
                key={stream.id}
                className="flex items-center text-white cursor-pointer hover:bg-gray-600 py-2 px-3 rounded-lg"
                onClick={() => handleStreamClick(stream)}
              >
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="font-semibold">{stream.title}</p>
                  <p className="text-sm text-gray-200">
                    {stream.user.first_name} {stream.user.last_name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-white text-sm text-center">No active streams</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
