import { ChatMessage } from "./ChatMessage";

export const ChatList = ({ messages, isHidden, isLoading }) => {
  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-transparent border-2 border-white p-3">
        <p className="text-sm text-emerald-400">
          {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-auto p-3 h-full bg-transparent border-2 border-white">
      {messages.map((message) => (
        <ChatMessage key={message.timestamp} data={message} />
      ))}
    </div>
  );
};

// ChatListSkeleton without Skeleton component
export const ChatListSkeleton = () => {
  return (
    <div className="flex h-full items-center justify-center bg-transparent border-2 border-white">
      {/* Simple loading text or a placeholder for the skeleton */}
      <p className="text-sm text-emerald-400">Loading chat...</p>
    </div>
  );
};
