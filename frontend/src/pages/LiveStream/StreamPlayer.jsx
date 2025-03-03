import { LiveKitRoom } from "@livekit/components-react";
import { useViewerTokenStore } from "../../stores/useViewerTokenStore";
import InfoCard from "./InfoCard";
import { AboutCard } from "./AboutCard";
import { Chat, ChatSkeleton } from "./Chat";
import { Video, VideoSkeleton } from "./Video";
import { Header, HeaderSkeleton } from "./Header";
import { useEffect, useState } from "react";

const StreamPlayer = ({ user, stream, isFollowing }) => {
  const [loading, setLoading] = useState(true); // Add loading state to handle asynchronous token fetching
  const { token, name, identity, fetchViewerToken } = useViewerTokenStore((state) => ({
    token: state.token,
    name: state.name,
    identity: state.identity,
    fetchViewerToken: state.fetchViewerToken, // Extract the fetch function
  }));
  console.log(stream, loading, token, name, identity, user);
  // Fetch viewer token when user.id changes
  useEffect(() => {
    if (user?.id) {
      fetchViewerToken(user.id); // Fetch the token using user.id
      setLoading(true); // Start loading
    }
  }, [user?.id, fetchViewerToken]); // Trigger useEffect whenever user.id changes

  // Once the token is fetched, set loading to false
  useEffect(() => {
    if (token) {
      setLoading(false); // Set loading to false once the token is available
    }
  }, [token]); // Watch the token for when it's fetched

  // Handle case when user or stream or other critical data is null or undefined
  if (loading || !user || !stream || !token || !name || !identity) {
    return <StreamPlayerSkeleton />;
  }

  // Concatenate first name and last name for the full name
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

  return (
    <>
      <LiveKitRoom
        token={token}
        serverUrl={import.meta.env.VITE_PUBLIC_LIVEKIT_WS_URL}
        className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full"
      >
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video hostName={fullName} hostIdentity={user.id} />
          <Header
            hostName={fullName} // Use full name here
            hostIdentity={user.id}
            viewerIdentity={identity}
            imageUrl={user.profile_picture}
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
            headline={user.headline}
            about={user.about}
            followedByCount={user._count?.followedBy || 0}
          />
        </div>
        <div className="col-span-1">
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
  console.log("skeleton");
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
