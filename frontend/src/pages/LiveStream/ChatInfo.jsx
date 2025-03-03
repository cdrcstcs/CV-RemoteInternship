import { useMemo } from "react";
import { Info } from "lucide-react";

export const ChatInfo = ({ isDelayed, isFollowersOnly }) => {
  const hint = useMemo(() => {
    if (isFollowersOnly && !isDelayed) {
      return "Only followers can chat";
    }

    if (isDelayed && !isFollowersOnly) {
      return "Messages are delayed by 3 seconds";
    }

    if (isDelayed && isFollowersOnly) {
      return "Only followers can chat. Messages are delayed by 3 seconds";
    }

    return "";
  }, [isDelayed, isFollowersOnly]);

  const label = useMemo(() => {
    if (isFollowersOnly && !isDelayed) {
      return "Followers only";
    }

    if (isDelayed && !isFollowersOnly) {
      return "Slow mode";
    }

    if (isDelayed && isFollowersOnly) {
      return "Followers only and slow mode";
    }

    return "";
  }, [isDelayed, isFollowersOnly]);

  if (!isDelayed && !isFollowersOnly) {
    return null;
  }

  return (
    <div className="p-2 text-emerald-400 bg-transparent border-2 border-white w-full rounded-t-md flex items-center gap-x-2">
      {/* Use title attribute for tooltip */}
      <Info className="h-4 w-4 text-emerald-400" title={hint} />
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
};
