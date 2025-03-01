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
          isLive && "ring-2 ring-rose-500 border border-background",
          avatarSizes({ size }),
          "rounded-full overflow-hidden" // This makes the avatar circular
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${username}'s avatar`}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-white bg-gray-400">
            {username[0]}
            {username[username.length - 1]}
          </span>
        )}
      </div>
      {canShowBadge && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
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
        "bg-gray-300 animate-pulse rounded-full",
        avatarSizes({ size })
      )}
    />
  );
};

export { UserAvatar, UserAvatarSkeleton };
