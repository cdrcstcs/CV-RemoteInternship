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
      className="flex flex-col items-center gap-y-4 p-3 bg-transparent"
    >
      <div className="w-full">
        {/* Chat Info */}
        <ChatInfo
          isDelayed={isDelayed}
          isFollowersOnly={isFollowersOnly}
          className="text-emerald-400" // Apply emerald text color
        />

        <input
          onChange={(e) => onChange(e.target.value)}
          value={value}
          disabled={isDisabled}
          placeholder="Send a message"
          className={cn(
            "w-full p-2 border-2 border-white rounded-md text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-transparent",
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
            "px-4 py-2 bg-transparent border-2 border-white rounded-md text-emerald-400",
            isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-emerald-400 hover:text-white"
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
    <div className="text-sm text-emerald-400 mb-2">
      {isDelayed && <p>Message delay is active...</p>}
      {isFollowersOnly && <p>Followers only mode</p>}
    </div>
  );
};
