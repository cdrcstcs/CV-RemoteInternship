import { Outlet } from "react-router-dom";
import ChatList from "./ChatList";
const DashboardLayout = () => {
  return (
    <div className="flex gap-12 pt-5 h-full">
      <div className="flex-1">
        <ChatList />
      </div>
      <div className="flex-4 bg-[#12101b]">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
