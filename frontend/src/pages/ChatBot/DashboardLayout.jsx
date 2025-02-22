import { Outlet } from "react-router-dom";
import ChatList from "./ChatList";

const DashboardLayout = () => {
  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Sidebar (Chat List) */}
      <div className="w-full lg:w-1/4 p-5">
        <ChatList />
      </div>

      {/* Main content area */}
      <div className="w-full lg:w-3/4 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
