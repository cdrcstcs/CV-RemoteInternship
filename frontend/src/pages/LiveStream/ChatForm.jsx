import { useState } from "react";
import { cn } from "../../helpers";  // Assuming you have a helper function for conditional classnames

export const ChatForm = ({
  onSubmit,
  value,
  onChange,
  isHidden,
  isFollowersOnly,
  isFollowing,
  isDelayed,
}) => {
  const [isDelayBlocked, setIsDelayBlocked] = useState(false);

  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled =
    isHidden || isDelayBlocked || isFollowersOnlyAndNotFollowing;

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!value || isDisabled) return;

    if (isDelayed && !isDelayBlocked) {
      setIsDelayBlocked(true);
      setTimeout(() => {
        setIsDelayBlocked(false);
        onSubmit();
      }, 3000);
    } else {
      onSubmit();
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-y-4 p-3"
    >
      <div className="w-full">
        {/* Chat Info */}
        <ChatInfo isDelayed={isDelayed} isFollowersOnly={isFollowersOnly} />

        <input
          onChange={(e) => onChange(e.target.value)}
          value={value}
          disabled={isDisabled}
          placeholder="Send a message"
          className={cn(
            "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            (isFollowersOnly || isDelayed) && "rounded-t-none border-t-0",
            isDisabled && "bg-gray-300 cursor-not-allowed"
          )}
        />
      </div>

      <div className="ml-auto">
        <button
          type="submit"
          disabled={isDisabled}
          className={cn(
            "px-4 py-2 text-white bg-blue-600 rounded-md",
            isDisabled ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"
          )}
        >
          Chat
        </button>
      </div>
    </form>
  );
};

export const ChatFormSkeleton = ({ isDelayed, isFollowersOnly }) => {
  return (
    <div className="text-sm text-gray-500 mb-2">
      {isDelayed && <p>Message delay is active...</p>}
      {isFollowersOnly && <p>Followers only mode</p>}
    </div>
  );
};
