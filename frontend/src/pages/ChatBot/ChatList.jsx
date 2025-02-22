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
      <Link to="/chatbot" className="p-2 rounded-md hover:bg-gray-700">
        Create a new Chat
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
                to={`/chatbot/chats/${chat._id}`}
                key={chat._id}
                className="p-2 rounded-md hover:bg-gray-700"
              >
                {chat.title}
              </Link>
            ))}
      </div>
    </div>
  );
};

export default ChatList;
