import { useEffect, useMemo, useState } from "react";
import { ConnectionState } from "livekit-client";
import { useMediaQuery } from "usehooks-ts";
import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";

import { useAppDispatch, useAppSelector } from "../../pages/State/Redux"; // Add Redux hooks
import { setIsSidebarCollapsed } from "../../pages/State/State"; // Import action
import { ChatForm, ChatFormSkeleton } from "./ChatForm";
import { ChatList, ChatListSkeleton } from "./ChatList";
import { ChatHeader, ChatHeaderSkeleton } from "./ChatHeader";
import { ChatCommunity } from "./ChatCommunity";

const Chat = ({
  hostName,
  hostIdentity,
  viewerName,
  isFollowing,
  isChatEnabled,
  isChatDelayed,
  isChatFollowersOnly,
}) => {
  const dispatch = useAppDispatch(); // Use dispatch for Redux
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  ); // Get sidebar state from Redux

  const matches = useMediaQuery("(max-width: 1024px)");
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);

  const isOnline = participant && connectionState === ConnectionState.Connected;

  const isHidden = !isChatEnabled || !isOnline;

  const [value, setValue] = useState("");
  const { chatMessages: messages, send } = useChat();

  useEffect(() => {
    if (matches) {
      dispatch(setIsSidebarCollapsed(true)); // Collapse sidebar when on mobile
    } else {
      dispatch(setIsSidebarCollapsed(false)); // Expand sidebar when on larger screens
    }
  }, [matches, dispatch]); // Dependency array includes dispatch and matches

  const reversedMessages = useMemo(() => {
    return messages.sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);

  const onSubmit = () => {
    if (!send) return;

    send(value);
    setValue("");
  };

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]">
      <ChatHeader />
      <ChatList messages={reversedMessages} isHidden={isHidden} />
      <ChatForm
        onSubmit={onSubmit}
        value={value}
        onChange={onChange}
        isHidden={isHidden}
        isFollowersOnly={isChatFollowersOnly}
        isDelayed={isChatDelayed}
        isFollowing={isFollowing}
      />
      <ChatCommunity
        viewerName={viewerName}
        hostName={hostName}
        isHidden={isHidden}
      />
    </div>
  );
};

const ChatSkeleton = () => {
  return (
    <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
      <ChatHeaderSkeleton />
      <ChatListSkeleton />
      <ChatFormSkeleton />
    </div>
  );
};

export { Chat, ChatSkeleton };
