import React, { useEffect } from "react";
import useVideoChatStore from "../../stores/useVideoChatStore";
import { toast } from "react-hot-toast";

const VideoChat = () => {
  const {
    accessToken,
    isProcessingChat,
    isErrorChat,
    errorMessageChat,
    isSuccessChat,
    room,
    participants,
    getAccessToken,
    reset,
  } = useVideoChatStore((state) => ({
    accessToken: state.accessToken,
    isProcessingChat: state.isProcessingChat,
    isErrorChat: state.isErrorChat,
    errorMessageChat: state.errorMessageChat,
    isSuccessChat: state.isSuccessChat,
    room: state.room,
    participants: state.participants,
    getAccessToken: state.getAccessToken,
    reset: state.reset,
  }));

  useEffect(() => {
    if (!accessToken && !isProcessingChat) {
      getAccessToken(); // Automatically fetch access token and connect to the room
    }
  }, [accessToken, isProcessingChat, getAccessToken]);

  const handleReset = () => {
    reset();
    toast.info("Video chat has been reset.");
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleReset}
          className="bg-red-500 text-white p-2 rounded"
        >
          Reset Chat
        </button>
      </div>

      <div
        id="video-chat-window"
        className="fixed bg-gray-300 top-0 bottom-0 w-full h-full overflow-y-scroll grid grid-rows-3 grid-cols-2 md:grid-cols-3 gap-2 px-2 pt-2"
      >
        {participants.map((participant) => (
          <div
            key={participant.sid}
            className="overflow-hidden rounded-md bg-gray-100 z-10"
          >
            {/* Render Participant's Video */}
            <div id={participant.sid}></div>
            <p className="text-center">{participant.identity}</p>
          </div>
        ))}
      </div>

      {isProcessingChat && <div className="text-center">Connecting...</div>}
      {isErrorChat && (
        <div className="text-center text-red-500">
          Error: {errorMessageChat}
        </div>
      )}
      {isSuccessChat && (
        <div className="text-center text-green-500">
          Successfully connected to the room!
        </div>
      )}
    </div>
  );
};

export default VideoChat;
