import { cva } from "class-variance-authority";
import { cn } from "../../helpers";
import LiveBadge from "./LiveBadge";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const UserAvatar = ({
  username,
  imageUrl,
  isLive,
  showBadge,
  size,
}) => {
  const canShowBadge = showBadge && isLive;

  return (
    <div className="relative">
      <div
        className={cn(
          isLive && "ring-2 ring-emerald-400 border-2 border-white", // Border color is emerald and white
          avatarSizes({ size }),
          "rounded-full overflow-hidden bg-transparent" // Set background to transparent
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${username}'s avatar`}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-emerald-400 bg-transparent">
            {username[0]}
            {username[username.length - 1]}
          </span>
        )}
      </div>
      {canShowBadge && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-emerald-400"> {/* Icon color set to emerald-400 */}
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

const UserAvatarSkeleton = ({ size }) => {
  return (
    <div
      className={cn(
        "bg-transparent animate-pulse border-2 border-white rounded-full", // Background transparent, white border
        avatarSizes({ size })
      )}
    />
  );
};

export { UserAvatar, UserAvatarSkeleton };
