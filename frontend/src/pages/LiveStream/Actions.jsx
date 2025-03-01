import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useTransition } from "react";
import { cn } from "../../helpers";
import { useUserStore } from "../../stores/useUserStore";
import useLiveStreamStore from "../../stores/useLiveStreamStore";

export const Actions = ({
  hostIdentity,
  isFollowing,
  isHost,
}) => {
  const [isPending, startTransition] = useTransition();
  const { followUser, unfollowUser } = useLiveStreamStore(); // Fetch the store's actions
  const { user } = useUserStore(); // Get user data from the user store
  const userId = user.id;

  const handleFollow = async () => {
    startTransition(() => {
      try {
        const data = followUser(hostIdentity); 
        // Update toast to show first_name and last_name
        toast.success(`You are now following ${data.following.first_name} ${data.following.last_name}`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  const handleUnfollow = async () => {
    startTransition(() => {
      try {
        const data = unfollowUser(hostIdentity); 
        // Update toast to show first_name and last_name
        toast.success(`You have unfollowed ${data.following.first_name} ${data.following.last_name}`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  const toggleFollow = () => {
    if (!userId) {
      return alert("You need to sign in first"); // Replaced Next.js router with a simple alert
    }

    if (isHost) return;

    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <button
      disabled={isPending || isHost}
      onClick={toggleFollow}
      style={{
        width: "100%",
        maxWidth: "auto",
        padding: "8px 16px",
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      <Heart
        className={cn("h-4 w-4 mr-2", isFollowing ? "fill-white" : "fill-none")}
      />
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export const ActionsSkeleton = () => {
  return (
    <div
      style={{
        height: "40px",
        width: "100%",
        maxWidth: "100px",
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
      }}
    />
  );
};
