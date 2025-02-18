import { useEffect } from "react";
import useSocialMediaStore from "../../stores/useSocialMediaStore";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

const RecommendedUser = ({ user }) => {
  const {
    connectionStatuses, 
    isLoadingConnectionStatus, 
    fetchConnectionStatus, 
    sendConnectionRequest, 
    acceptConnectionRequestForRecommendedUser, 
    rejectConnectionRequestForRecommendedUser 
  } = useSocialMediaStore();

  // Fetch connection status when the component mounts
  useEffect(() => {
    // Fetch connection status for this user only when the user ID changes
    fetchConnectionStatus(user.id);
  }, [user.id, fetchConnectionStatus]);

  const renderButton = () => {
    // Use get() to ensure `connectionStatuses` exists and get the status
    const status = connectionStatuses.find(conn => conn.userId === user.id); // Find the status for this user
    
    if (isLoadingConnectionStatus) {
      return (
        <button className="px-3 py-1 rounded-full text-sm border-2 border-white text-emerald-400" disabled>
          Loading...
        </button>
      );
    }

    if (!status) {
      return (
        <button
          className="px-3 py-1 rounded-full text-sm border-2 border-white text-emerald-400 hover:bg-emerald-400 hover:text-white transition-colors duration-200"
          onClick={() => sendConnectionRequest(user.id)}
        >
          <UserPlus size={16} className="mr-1 text-emerald-400" />
          Connect
        </button>
      );
    }

    switch (status.status) {
      case "pending":
        return (
          <button className="px-3 py-1 rounded-full text-sm border-2 border-white text-emerald-400 flex items-center" disabled>
            <Clock size={16} className="mr-1 text-emerald-400" />
            Pending
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => acceptConnectionRequestForRecommendedUser(status.requestId)}
              className="rounded-full p-1 flex items-center justify-center border-2 border-white text-emerald-400 hover:bg-emerald-400 hover:text-white transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => rejectConnectionRequestForRecommendedUser(status.requestId)}
              className="rounded-full p-1 flex items-center justify-center border-2 border-white text-emerald-400 hover:bg-red-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button className="px-3 py-1 rounded-full text-sm border-2 border-white text-emerald-400 flex items-center" disabled>
            <UserCheck size={16} className="mr-1 text-emerald-400" />
            Connected
          </button>
        );
      default:
        return (
          <button
            className="px-3 py-1 rounded-full text-sm border-2 border-white text-emerald-400 hover:bg-emerald-400 hover:text-white transition-colors duration-200"
            onClick={() => sendConnectionRequest(user.id)}
          >
            <UserPlus size={16} className="mr-1 text-emerald-400" />
            Connect
          </button>
        );
    }
  };

  return (
    <div className="flex items-center justify-between mb-4 border-2 border-white rounded-lg p-4 text-emerald-400">
      <div className="flex items-center">
        <img src={user.profile_picture || "/avatar.png"} className="w-12 h-12 rounded-full mr-3" />
        <div className="text-start">
          <h3 className="font-semibold text-sm">{user.first_name + " " + user.last_name}</h3>
          <p className="text-xs">{user.headline}</p>
        </div>
      </div>
      <div className="ml-4">
        {renderButton()}
      </div>
    </div>
  );
};

export default RecommendedUser;
