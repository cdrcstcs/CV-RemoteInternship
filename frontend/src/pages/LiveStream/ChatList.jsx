import { ChatMessage } from "./ChatMessage";

export const ChatList = ({ messages, isHidden, isLoading }) => {
  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-auto p-3 h-full">
      {messages.map((message) => (
        <ChatMessage key={message.timestamp} data={message} />
      ))}
    </div>
  );
};

// ChatListSkeleton without Skeleton component
export const ChatListSkeleton = () => {
  return (
    <div className="flex h-full items-center justify-center">
      {/* Simple loading text or a placeholder for the skeleton */}
      <p className="text-sm text-muted-foreground">Loading chat...</p>
    </div>
  );
};
