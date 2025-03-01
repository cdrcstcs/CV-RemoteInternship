import { LiveKitRoom } from "@livekit/components-react";
import { cn } from "../../helpers";
import { useViewerTokenStore } from "../../stores/useViewerTokenStore";
import InfoCard from "./InfoCard";
import { AboutCard } from "./AboutCard";
import { ChatToggle } from "./ChatToggle";
import { Chat, ChatSkeleton } from "./Chat";
import { Video, VideoSkeleton } from "./Video";
import { Header, HeaderSkeleton } from "./Header";
import { useAppSelector } from "../State/Redux";

const StreamPlayer = ({ user, stream, isFollowing }) => {
  const { token, name, identity } = useViewerTokenStore(user?.id);
  const isSidebarCollapsed = useAppSelector(
      (state) => state.global.isSidebarCollapsed
  );

  // Handle case when user or stream or other critical data is null or undefined
  if (!user || !stream || !token || !name || !identity) {
    return <StreamPlayerSkeleton />;
  }

  // Concatenate first name and last name for the full name
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

  return (
    <>
      {isSidebarCollapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ChatToggle />
        </div>
      )}
      <LiveKitRoom
        token={token}
        serverUrl={process.env.VITE_PUBLIC_LIVEKIT_WS_URL}
        className={cn(
          "grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full",
          isSidebarCollapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
        )}
      >
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video hostName={fullName} hostIdentity={user.id} />
          <Header
            hostName={fullName} // Use full name here
            hostIdentity={user.id}
            viewerIdentity={identity}
            imageUrl={user.imageUrl}
            isFollowing={isFollowing}
            name={stream.title || "Untitled Stream"}
          />
          <InfoCard
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={stream.title || "Untitled Stream"}
            thumbnailUrl={stream.thumbnail || ""}
          />
          <AboutCard
            hostName={fullName} // Use full name here
            hostIdentity={user.id}
            viewerIdentity={identity}
            bio={user.bio || "No bio available"}
            followedByCount={user._count?.followedBy || 0}
          />
        </div>
        <div className={cn("col-span-1", isSidebarCollapsed && "hidden")}>
          <Chat
            viewerName={name || "Guest"}
            hostName={fullName} // Use full name here
            hostIdentity={user.id}
            isFollowing={isFollowing}
            isChatEnabled={stream.isChatEnabled || false}
            isChatDelayed={stream.isChatDelayed || false}
            isChatFollowersOnly={stream.isChatFollowersOnly || false}
          />
        </div>
      </LiveKitRoom>
    </>
  );
};

const StreamPlayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
      <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>
      <div className="col-span-1 bg-background">
        <ChatSkeleton />
      </div>
    </div>
  );
};

export { StreamPlayer, StreamPlayerSkeleton };
