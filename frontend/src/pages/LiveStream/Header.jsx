import { UserIcon } from "lucide-react";
import { useParticipants, useRemoteParticipant } from "@livekit/components-react";

import { VerifiedMark } from "./VerifiedMark";
import { UserAvatar, UserAvatarSkeleton } from "./UserAvatar";
import { Actions, ActionsSkeleton } from "./Actions";

const Header = ({
  imageUrl,
  hostName,
  hostIdentity,
  viewerIdentity,
  isFollowing = false,
  name,
}) => {
  const participants = useParticipants();
  const participant = useRemoteParticipant(hostIdentity);

  const isLive = !!participant;
  const participantCount = participants.length - 1;

  const hostAsViewer = `Host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  return (
    <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4 bg-transparent border-2 border-white">
      <div className="flex items-center gap-x-3">
        <UserAvatar
          imageUrl={imageUrl}
          username={hostName}
          size="lg"
          isLive={isLive}
          showBadge
        />
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <h2 className="text-lg font-semibold text-emerald-400">{hostName}</h2>
            <VerifiedMark />
          </div>
          <p className="text-sm font-semibold text-emerald-400">{name}</p>
          {isLive ? (
            <div className="font-semibold flex gap-x-1 items-center text-xs text-emerald-400">
              <UserIcon className="h-4 w-4 text-emerald-400" />
              <p>
                {participantCount}{" "}
                {participantCount === 1 ? "viewer" : "viewers"}
              </p>
            </div>
          ) : (
            <p className="font-semibold text-xs text-emerald-400">
              Offline
            </p>
          )}
        </div>
      </div>
      <Actions
        isFollowing={isFollowing}
        hostIdentity={hostIdentity}
        isHost={isHost}
      />
    </div>
  );
};

const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-start justify-between px-4 bg-transparent border-2 border-white">
      <div className="flex items-center gap-x-2">
        <UserAvatarSkeleton size="lg" />
        <div className="space-y-2">
          <UserAvatarSkeleton size="md" />
          <UserAvatarSkeleton size="sm" />
        </div>
      </div>
      <ActionsSkeleton />
    </div>
  );
};

export { Header, HeaderSkeleton };
