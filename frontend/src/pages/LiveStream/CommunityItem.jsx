import { useTransition } from "react";
import { MinusCircle } from "lucide-react";
import useLiveStreamStore from "../../stores/useLiveStreamStore";
import { cn, stringToColor } from "../../helpers";

const CommunityItem = ({
  hostName,
  viewerName,
  participantIdentity,
  participantName,
}) => {
  const [isPending, startTransition] = useTransition();

  // Access the blockUser method and the block-related states from the store
  const {
    blockUser,
    isProcessingBlock,
    isErrorBlock,
    errorMessageBlock,
  } = useLiveStreamStore((state) => ({
    blockUser: state.blockUser,
    isProcessingBlock: state.isProcessingBlock,
    isErrorBlock: state.isErrorBlock,
    errorMessageBlock: state.errorMessageBlock,
  }));

  const color = stringToColor(participantName || "");
  const isSelf = participantName === viewerName;
  const isHost = viewerName === hostName;

  const handleBlock = () => {
    if (!participantName || isSelf || !isHost) return;

    startTransition(() => {
      blockUser(participantIdentity);
    });
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between w-full p-2 rounded-md text-sm border-2 border-white bg-transparent hover:bg-white/5",
        isPending || isProcessingBlock ? "opacity-50 pointer-events-none" : ""
      )}
    >
      {/* Participant Name */}
      <p className="text-emerald-400" style={{ color: color }}>
        {participantName}
      </p>

      {/* Block Button */}
      {isHost && !isSelf && !isProcessingBlock && !isErrorBlock && (
        <div
          title="Block"
          onClick={handleBlock}
          className="h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
        >
          <MinusCircle className="h-4 w-4 text-emerald-400" />
        </div>
      )}

      {/* Display an error message if blocking fails */}
      {isErrorBlock && errorMessageBlock && (
        <p className="text-xs text-red-500">{errorMessageBlock}</p>
      )}

      {/* Show loading state */}
      {isProcessingBlock && (
        <p className="text-xs text-muted-foreground">Blocking...</p>
      )}
    </div>
  );
};

export default CommunityItem;
