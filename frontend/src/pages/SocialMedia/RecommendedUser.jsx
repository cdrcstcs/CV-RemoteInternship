import { useEffect } from "react";
import useSocialMediaStore from "../../stores/useSocialMediaStore";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

const RecommendedUser = ({ user }) => {
  const { connectionStatus, isLoadingConnectionStatus, fetchConnectionStatus, sendConnectionRequest, acceptConnectionRequestForRecommendedUser, rejectConnectionRequestForRecommendedUser } = useSocialMediaStore((state) => state);
  
  // Fetch connection status when the component mounts
  useEffect(() => {
    fetchConnectionStatus(user.id);
  }, [user.id, fetchConnectionStatus]);

  const renderButton = () => {
    if (isLoadingConnectionStatus) {
      return (
        <button className='px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500' disabled>
          Loading...
        </button>
      );
    }

    switch (connectionStatus?.status) {
      case "pending":
        return (
          <button
            className='px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center'
            disabled
          >
            <Clock size={16} className='mr-1' />
            Pending
          </button>
        );
      case "received":
        return (
          <div className='flex gap-2 justify-center'>
            <button
              onClick={() => acceptConnectionRequestForRecommendedUser(connectionStatus.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => rejectConnectionRequestForRecommendedUser(connectionStatus.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button
            className='px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center'
            disabled
          >
            <UserCheck size={16} className='mr-1' />
            Connected
          </button>
        );
      default:
        return (
          <button
            className='px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center'
            onClick={() => sendConnectionRequest(user.id)}
          >
            <UserPlus size={16} className='mr-1' />
            Connect
          </button>
        );
    }
  };

  return (
    <div className='flex items-center justify-between mb-4'>
		<img
			src={user.profilePicture || "/avatar.png"}
			className='w-12 h-12 rounded-full mr-3'
		/>
		<div>
			<h3 className='font-semibold text-sm'>{user.first_name + user.last_name}</h3>
			<p className='text-xs text-info'>{user.headline}</p>
		</div>
      {renderButton()}
    </div>
  );
};

export default RecommendedUser;
