import { ConnectionState, Track } from "livekit-client";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";

import OfflineVideo from "./OfflineVideo";
import LoadingVideo from "./LoadingVideo";
import LiveVideo from "./LiveVideo";

export const Video = ({ hostName, hostIdentity }) => {
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostIdentity);

  let content;

  if (!participant && connectionState === ConnectionState.Connected) {
    content = <OfflineVideo username={hostName} />;
  } else if (!participant || tracks.length === 0) {
    content = <LoadingVideo label={connectionState} />;
  } else {
    content = <LiveVideo participant={participant} />;
  }

  return (
    <div className="aspect-video border-2 border-white group relative bg-transparent">
      {content}
    </div>
  );
};

export const VideoSkeleton = () => {
  return (
    <div className="aspect-video border-2 border-white bg-transparent relative">
      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
    </div>
  );
};
