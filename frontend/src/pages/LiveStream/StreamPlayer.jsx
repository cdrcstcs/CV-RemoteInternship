import { LiveKitRoom } from "@livekit/components-react";
import { useViewerTokenStore } from "../../stores/useViewerTokenStore";
import InfoCard from "./InfoCard";
import { AboutCard } from "./AboutCard";
import { Video, VideoSkeleton } from "./Video";
import { Header, HeaderSkeleton } from "./Header";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useLiveStreamStore from "../../stores/useLiveStreamStore";
import KeyCard from "./KeyCard";
import UrlCard from "./UrlCard";
import StreamMessages from "./StreamMessages";
import { useUserStore } from "../../stores/useUserStore";

const StreamPlayer = ({ user, stream, isFollowing, onCloseCreateStream }) => {
  onCloseCreateStream();
  const { user: authenticatedUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const { token, name, identity, fetchViewerToken } = useViewerTokenStore((state) => ({
    token: state.token,
    name: state.name,
    identity: state.identity,
    fetchViewerToken: state.fetchViewerToken,
  }));

  const { isStoppingStream, stopStream } = useLiveStreamStore((state) => ({
    isStoppingStream: state.isStoppingStream,
    stopStream: state.stopStream,
  }));

  useEffect(() => {
    if (user?.id) {
      fetchViewerToken(user.id);
      setLoading(true);
    }
  }, [user?.id, fetchViewerToken]);

  useEffect(() => {
    if (token) {
      setLoading(false);
    }
  }, [token]);

  if (loading || !user || !stream || !token || !name || !identity) {
    return <StreamPlayerSkeleton />;
  }

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  const handleStopStream = () => {
    toast.success("Stream is being stopped...");
    stopStream(stream.id);
  };

  return (
    <>
      <LiveKitRoom
        token={token}
        serverUrl={import.meta.env.VITE_PUBLIC_LIVEKIT_WS_URL}
        className="h-full flex flex-col lg:flex-row gap-6 p-4"
      >
        {/* Left section: Stream and Stream Details */}
        <div className="flex-1 space-y-4 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video hostName={fullName} hostIdentity={user.id} />
          <KeyCard value={stream.streamKey} />
          <UrlCard value={stream.serverUrl} />
          <button
            onClick={handleStopStream}
            disabled={isStoppingStream}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            {isStoppingStream ? "Stopping..." : "Stop Stream"}
          </button>
          <Header
            hostName={fullName}
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
            hostName={fullName}
            hostIdentity={user.id}
            viewerIdentity={identity}
            headline={user.headline}
            about={user.about}
            followedByCount={user._count?.followedBy || 0}
          />
        </div>

        {/* Right section: StreamMessages */}
        <div className="w-full lg:w-1/3 rounded-lg shadow-md h-screen">
          <StreamMessages
            creatorId={user.id}
            viewerId={authenticatedUser.id}
            streamId={stream.id}
          />
        </div>
      </LiveKitRoom>
    </>
  );
};

const StreamPlayerSkeleton = () => {
  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-4">
      {/* Left section: Skeleton for Stream and Stream Details */}
      <div className="flex-1 space-y-4 lg:overflow-y-auto hidden-scrollbar pb-10">
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>

      {/* Right section: Skeleton for StreamMessages */}
      <div className="w-full lg:w-1/3 bg-gray-200 rounded-lg shadow-md h-screen">
        <div className="h-full w-full bg-gray-300 rounded-md" />
      </div>
    </div>
  );
};

export { StreamPlayer, StreamPlayerSkeleton };
