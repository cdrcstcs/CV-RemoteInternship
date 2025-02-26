import React, { useEffect, useRef, useState } from "react";
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

  const videoRefs = useRef({});
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    if (!accessToken && !isProcessingChat) {
      getAccessToken();
    }

    return () => {
      videoRefs.current = {};
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [accessToken, isProcessingChat, getAccessToken, localStream]);

  const handleReset = () => {
    reset();
    toast.info("Video chat has been reset.");
  };

  const renderVideoTrack = (participant) => {
    const videoDiv = videoRefs.current[participant.sid];
    if (videoDiv) {
      participant.tracks.forEach((track) => {
        if (track.kind === "video") {
          const videoElement = document.createElement("video");
          videoElement.srcObject = new MediaStream([track.mediaStreamTrack]);
          videoElement.autoplay = true;
          videoElement.playsInline = true;
          videoElement.muted = false;

          videoElement.onloadedmetadata = () => {
            videoElement.play().catch((err) => {
              console.error("Error playing video: ", err);
            });
          };

          videoDiv.appendChild(videoElement);
        }
      });
    }
  };

  const handleParticipantConnected = (participant) => {
    participant.on("trackSubscribed", (track) => {
      if (track.kind === "video") {
        renderVideoTrack(participant);
      }
    });

    renderVideoTrack(participant);
  };

  const handleParticipantDisconnected = (participant) => {
    const videoDiv = videoRefs.current[participant.sid];
    if (videoDiv) {
      videoDiv.innerHTML = "";
    }

    delete videoRefs.current[participant.sid];
  };

  const getLocalVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      if (localVideoRef.current) {
        const videoElement = localVideoRef.current;
        videoElement.srcObject = stream;
        videoElement.muted = true;
        videoElement.play().catch((err) => {
          console.error("Error playing local video: ", err);
        });
      }
    } catch (err) {
      console.error("Error accessing local video stream:", err);
      toast.error("Error accessing your camera.");
    }
  };

  useEffect(() => {
    if (room) {
      room.on("participantConnected", handleParticipantConnected);
      room.on("participantDisconnected", handleParticipantDisconnected);

      room.participants.forEach((participant) => {
        handleParticipantConnected(participant);
      });

      return () => {
        room.off("participantConnected", handleParticipantConnected);
        room.off("participantDisconnected", handleParticipantDisconnected);
      };
    }
  }, [room]);

  useEffect(() => {
    if (!localStream) {
      getLocalVideoStream();
    }
  }, [localStream]);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center py-6 mt-10">
      <div className="w-full max-w-4xl px-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleReset}
            className="bg-red-500 text-white p-3 rounded-lg shadow-lg transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Reset Chat
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Render local participant */}
          <div className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <p className="absolute bottom-2 left-2 text-white text-lg font-semibold z-10">
              You (Local)
            </p>
          </div>

          {/* Render remote participants */}
          {participants.map((participant) => (
            <div
              key={participant.sid}
              className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div
                ref={(el) => (videoRefs.current[participant.sid] = el)}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <p className="absolute bottom-2 left-2 text-white text-lg font-semibold z-10">
                {participant.identity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isProcessingChat && (
        <div className="text-white mt-4">Connecting...</div>
      )}
      {isErrorChat && (
        <div className="text-red-500 mt-4 text-center">{`Error: ${errorMessageChat}`}</div>
      )}
      {isSuccessChat && (
        <div className="text-green-500 mt-4 text-center">Successfully connected to the room!</div>
      )}
    </div>
  );
};

export default VideoChat;
