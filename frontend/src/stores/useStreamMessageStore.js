import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance
import { toast } from "react-hot-toast";

export const useStreamMessageStore = create((set, get) => ({
  // Initial state for the stream messages store
  messages: [], // Store all messages
  isProcessingMessage: false, // Flag to track if the message is being sent
  isErrorMessage: false, // Flag to track if there's an error sending the message
  errorMessageMessage: "", // Error message if any
  isSuccessMessage: false, // Flag to track if the message was sent successfully

  // Function to send a message to a viewer
  sendMessage: async (message, creatorId, viewerId, streamId) => {
    const { isProcessingMessage } = get();

    // Prevent sending a message if one is already being processed
    if (isProcessingMessage) return;

    set({ isProcessingMessage: true, isErrorMessage: false, errorMessageMessage: "", isSuccessMessage: false });

    try {
      // Send the message data to the backend
      const response = await axiosInstance.post("/stream-message", {
        'message' : message,
        'creator_id' : creatorId,
        'viewer_id' : viewerId,
        'stream_id' : streamId,
      }); // Replace with your backend URL

      set({
        isProcessingMessage: false,
        isSuccessMessage: true,
      });
      toast.success("Message sent successfully!");

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error sending message";
      set({
        isProcessingMessage: false,
        isErrorMessage: true,
        errorMessageMessage: errorMessage,
      });
      toast.error(errorMessage);
    }
  },

  // Function to get all messages sent by a specific creator
  getMessagesByCreator: async (creatorId) => {
    const { isProcessingMessage } = get();

    // Prevent making multiple requests if one is already in progress
    if (isProcessingMessage) return;

    set({ isProcessingMessage: true, isErrorMessage: false, errorMessageMessage: "", isSuccessMessage: false });

    try {
      // Get messages from the backend
      const response = await axiosInstance.get(`/stream-messages/creator/${creatorId}`); // Adjust with the correct backend route

      set({
        messages: response.data, // Store the messages in the state
        isProcessingMessage: false,
        isSuccessMessage: true,
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error retrieving messages";
      set({
        isProcessingMessage: false,
        isErrorMessage: true,
        errorMessageMessage: errorMessage,
      });
      toast.error(errorMessage);
    }
  },
  listenForNewMessage: (streamId) => {
    // Listen for new messages in the specified stream
    Echo.channel(`stream-chat.${streamId}`)
      .listen('StreamChatMessageSent', (event) => {
        console.log(event.message);
        // When a new message is received, append it to the messages array
        set((state) => ({
          messages: [...state.messages, event],
        }));
        toast.success("New message received!");
      });
  },
  // Function to reset the store
  reset: () => set({
    messages: [],
    isProcessingMessage: false,
    isErrorMessage: false,
    errorMessageMessage: "",
    isSuccessMessage: false,
  }),
}));

export default useStreamMessageStore;
