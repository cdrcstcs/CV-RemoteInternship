import { useState } from "react";
import LiveBadge from "./LiveBadge";
import { UserAvatar } from "./UserAvatar";

const Thumbnail = ({ src, fallback, isLive, username }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  let content;

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (!src) {
    content = (
      <div className="bg-background flex flex-col items-center justify-center gap-y-4 h-full w-full transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md">
        <UserAvatar
          size="lg"
          showBadge
          username={username}
          imageUrl={fallback}
          isLive={isLive}
        />
      </div>
    );
  } else {
    content = (
      <img
        src={src}
        alt="Thumbnail"
        onLoad={handleImageLoad}
        className={`object-cover transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
      />
    );
  }

  return (
    <div className="group aspect-video relative rounded-md cursor-pointer">
      <div className="rounded-md absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
      {content}
      {isLive && src && (
        <div className="absolute top-2 left-2 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

export { Thumbnail };
