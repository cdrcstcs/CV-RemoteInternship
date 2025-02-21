import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useChatBotStore from '../../stores/useChatBotStore';
const ChatList = () => {
  // Get the necessary state and actions from your Zustand store
  const { isLoading, error, chats, fetchUserChats } = useChatBotStore();

  useEffect(() => {
    // Fetch user chats when the component mounts
    fetchUserChats();
  }, [fetchUserChats]);

  return (
    <div className="flex flex-col h-full">
      <span className="font-semibold text-xs mb-2">DASHBOARD</span>
      <Link to="/dashboard" className="p-2 rounded-md hover:bg-gray-700">
        Create a new Chat
      </Link>
      <Link to="/" className="p-2 rounded-md hover:bg-gray-700">
        Explore Lama AI
      </Link>
      <Link to="/" className="p-2 rounded-md hover:bg-gray-700">
        Contact
      </Link>
      <hr className="border-none h-[2px] bg-gray-300 opacity-10 rounded-md my-5" />
      <span className="font-semibold text-xs mb-2">RECENT CHATS</span>
      <div className="flex flex-col overflow-scroll">
        {isLoading
          ? 'Loading...'
          : error
          ? 'Something went wrong!'
          : chats?.map((chat) => (
              <Link
                to={`/dashboard/chats/${chat._id}`}
                key={chat._id}
                className="p-2 rounded-md hover:bg-gray-700"
              >
                {chat.title}
              </Link>
            ))}
      </div>
      <hr className="border-none h-[2px] bg-gray-300 opacity-10 rounded-md my-5" />
      <div className="mt-auto flex items-center gap-3 text-xs">
        <img src="/logo.png" alt="" className="w-6 h-6" />
        <div className="flex flex-col">
          <span className="font-semibold">Upgrade to Lama AI Pro</span>
          <span className="text-gray-500">Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
