import { create } from "zustand";
import { connect } from "twilio-video";
import axiosInstance from "../lib/axios"; // Adjust with your axios instance path
import { toast } from "react-hot-toast";

export const useVideoChatStore = create((set, get) => ({
  accessToken: "", // Store the access token
  isProcessingChat: false, // Flag to track if the video chat is being processed
  isErrorChat: false, // Flag to track if there's an error
  errorMessageChat: "", // Error message if any
  isSuccessChat: false, // Flag to track if the video chat was successful
  room: null, // Store the current room object
  participants: [], // Store the participants in the room

  // Function to get the access token and connect to the video chat room
  getAccessToken: async () => {
    const { isProcessingChat } = get();

    // Prevent processing if it's already in progress
    if (isProcessingChat) return;

    set({
      isProcessingChat: true,
      isErrorChat: false,
      errorMessageChat: "",
      isSuccessChat: false,
    });

    try {
      // Request the access token from the backend
      const response = await axiosInstance.get("/video-chat/access_token");
      const token = response.data;

      set({ accessToken: token, isProcessingChat: false });
      toast.success("Access token fetched successfully!");

      // Proceed to connect to the video room
      await get().connectToRoom(token);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching access token";
      set({
        isProcessingChat: false,
        isErrorChat: true,
        errorMessageChat: errorMessage,
      });
      toast.error(errorMessage);
    }
  },

  // Function to connect to the video room
  connectToRoom: async (token) => {
    const { isProcessingChat } = get();

    // Prevent processing if it's already in progress
    if (isProcessingChat) return;

    set({
      isProcessingChat: true,
      isErrorChat: false,
      errorMessageChat: "",
      isSuccessChat: false,
    });

    try {
      const room = await connect(token, { audio: true, video: { width: 640, height: 640 } });

      // Store the room and participants in the state (convert Map to Array)
      set({
        room: room,
        participants: Array.from(room.participants.values()), // Convert Map to an array
        isProcessingChat: false,
        isSuccessChat: true,
      });

      // Listen for new participants and add them
      room.on('participantConnected', (participant) => get().addRemoteParticipant(participant));

      // Add existing participants
      room.participants.forEach(participant => get().addRemoteParticipant(participant));

      toast.success("Connected to the room successfully!");

    } catch (error) {
      const errorMessage = error.message || "Error connecting to the room";
      set({
        isProcessingChat: false,
        isErrorChat: true,
        errorMessageChat: errorMessage,
      });
      toast.error(errorMessage);
    }
  },

  // Function to add remote participants
  addRemoteParticipant: (participant) => {
    const { participants } = get();
    const updatedParticipants = [...participants, participant];
    set({ participants: updatedParticipants });

    // Handle track subscription for remote participants
    participant.on('trackSubscribed', track => {
      if (track.kind === 'video') {
        // Render the video track for remote participant
        const videoElement = document.createElement("video");
        videoElement.srcObject = new MediaStream([track.mediaStreamTrack]);
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        const videoContainer = document.getElementById(participant.sid);
        videoContainer.appendChild(videoElement);
      }
    });
  },

  // Function to reset the store state
  reset: () => set({
    accessToken: "",
    isProcessingChat: false,
    isErrorChat: false,
    errorMessageChat: "",
    isSuccessChat: false,
    room: null,
    participants: [],
  }),
}));

export default useVideoChatStore;
