import { useMemo, useState, useEffect } from "react";
import { useParticipants } from "@livekit/components-react"; // Using useParticipants hook

import { CommunityItem } from "./CommunityItem"; // Assuming you have this component for individual items

export const ChatCommunity = ({
  hostName,
  viewerName,
  isHidden,
}) => {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  // Debouncing logic: Update the debounced value after a delay of 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => {
      clearTimeout(handler); // Cleanup the previous timeout on value change
    };
  }, [value]);

  const participants = useParticipants();

  const onChange = (newValue) => {
    setValue(newValue);
  };

  const filteredParticipants = useMemo(() => {
    const deduped = participants.reduce((acc, participant) => {
      const hostAsViewer = `Host-${participant.identity}`;
      if (!acc.some((p) => p.identity === hostAsViewer)) {
        acc.push(participant);
      }
      return acc;
    }, []);

    return deduped.filter((participant) => {
      return participant.name
        ?.toLowerCase()
        .includes(debouncedValue.toLowerCase());
    });
  }, [participants, debouncedValue]);

  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Community is disabled</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search community"
        className="border border-gray-300 p-2 rounded-md w-full"
      />
      <div className="gap-y-2 mt-4 overflow-y-auto max-h-60">
        {filteredParticipants.length === 0 && (
          <p className="text-center text-sm text-muted-foreground p-2">No results</p>
        )}
        {filteredParticipants.map((participant) => (
          <CommunityItem
            key={participant.identity}
            hostName={hostName}
            viewerName={viewerName}
            participantName={participant.name}
            participantIdentity={participant.identity}
          />
        ))}
      </div>
    </div>
  );
};
