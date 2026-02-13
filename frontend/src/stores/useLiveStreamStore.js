import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Ensure this is the correct path to your axiosInstance
import { toast } from "react-hot-toast";

export const useLiveStreamStore = create((set, get) => ({
  // Block-related state
  blockedUsers: null,
  isProcessingBlock: false,
  isErrorBlock: false,
  errorMessageBlock: "",

  // Follow-related state
  followedUsers: null,
  isProcessingFollow: false,
  isErrorFollow: false,
  errorMessageFollow: "",

  // Stream-related state
  streamData: null, // Store a single stream
  streams: [], // Store many streams
  isProcessingStream: false,
  isErrorStream: false,
  errorMessageStream: "",


  isStoppingStream: false,
  isErrorStoppingStream: false,
  errorMessageStoppingStream: "",

  // Update-related state
  isProcessingUpdate: false,
  isErrorUpdate: false,
  errorMessageUpdate: "",

  isBlocked: false,
  viewerToken:"",
  // Function to create a new stream
  createStream: async (formData) => {
    const { isProcessingStream } = get();
    if (isProcessingStream) return;
  
    set({ isProcessingStream: true, isErrorStream: false, errorMessageStream: "" });
  
    try {
      // Modify formData for boolean fields before sending it to the server
      const booleanKeys = ['isChatEnabled', 'isChatDelayed', 'isChatFollowersOnly'];
  
      for (let [key, value] of formData.entries()) {
        // Check if the key is one of the boolean keys
        if (booleanKeys.includes(key)) {
          // Convert the value to a boolean (true or false) before setting it back in FormData
          const booleanValue = value === 'true' ? true : (value === 'false' ? false : value);
          formData.set(key, booleanValue); // Update the form data with the correct boolean value
        }
      }
  
      // Iterate over FormData and log key-value pairs
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      // Send the modified formData
      const response = await axiosInstance.post("/create-stream", formData);
  
      set({ streams: [...get().streams, response.data], isProcessingStream: false });
      toast.success("Stream created successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating stream";
      set({ isProcessingStream: false, isErrorStream: true, errorMessageStream: errorMessage });
      toast.error(errorMessage);
    }
  },
  
  stopStream: async (streamId = null) => {
    const { isProcessingStream } = get();
    if (isProcessingStream) return;
  
    set({ isStoppingStream: true, isErrorStoppingStream: false, errorMessageStoppingStream: "" });
  
    try {
      // Make the API request with the optional streamId parameter
      const requestPayload = streamId ? { stream_id: streamId } : {}; // If streamId is passed, include it in the request
      const response = await axiosInstance.post("/stop-stream", requestPayload);
  
      // Filter out the stopped stream from the list of active streams
      set({
        streams: get().streams.filter(stream => stream.id !== response.data.id),
        isStoppingStream: false,
      });
  
      toast.success("Stream stopped successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error stopping stream";
      set({ isStoppingStream: false, isErrorStream: true, errorMessageStoppingStream: errorMessage });
      toast.error(errorMessage);
    }
  },
  
  
  // Function to update user's headline and about
  updateUserHeadlineAndAbout: async (headline, about) => {
    const { isProcessingUpdate } = get();
    if (isProcessingUpdate) return;

    set({ isProcessingUpdate: true, isErrorUpdate: false, errorMessageUpdate: "" });

    try {
      const response = await axiosInstance.put("/user/headline-about", {
        headline,
        about,
      });
      set({ isProcessingUpdate: false });
      toast.success("Profile updated successfully!");
      return response.data; // Optionally return updated user data if needed
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating profile";
      set({ isProcessingUpdate: false, isErrorUpdate: true, errorMessageUpdate: errorMessage });
      toast.error(errorMessage);
    }
  },
  
  // Function to block a user
  blockUser: async (id) => {
    const { isProcessingBlock } = get();
    if (isProcessingBlock) return;

    set({ isProcessingBlock: true, isErrorBlock: false, errorMessageBlock: "" });

    try {
      const response = await axiosInstance.post(`/block/${id}`);
      set({ blockedUsers: response.data, isProcessingBlock: false });
      toast.success("User blocked successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error blocking user";
      set({ isProcessingBlock: false, isErrorBlock: true, errorMessageBlock: errorMessage });
      toast.error(errorMessage);
    }
  },

  // Function to unblock a user
  unblockUser: async (id) => {
    const { isProcessingBlock } = get();
    if (isProcessingBlock) return;

    set({ isProcessingBlock: true, isErrorBlock: false, errorMessageBlock: "" });

    try {
      const response = await axiosInstance.post(`/unblock/${id}`);
      set({ blockedUsers: response.data, isProcessingBlock: false });
      toast.success("User unblocked successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error unblocking user";
      set({ isProcessingBlock: false, isErrorBlock: true, errorMessageBlock: errorMessage });
      toast.error(errorMessage);
    }
  },

  // Function to get the list of blocked users
  getBlockedUsers: async () => {
    try {
      const response = await axiosInstance.get("/blocked-users");
      set({ blockedUsers: response.data });
    } catch (error) {
      toast.error("Error fetching blocked users");
    }
  },

  // Function to check if a user is blocked
  isBlockedByUser: async (id) => {
    try {
      const response = await axiosInstance.get(`/is-blocked/${id}`);
      set({ isBlocked: response.data });
    } catch (error) {
      toast.error("Error checking if user is blocked");
    }
  },

  // Function to follow a user
  followUser: async (id) => {
    const { isProcessingFollow } = get();
    if (isProcessingFollow) return;

    set({ isProcessingFollow: true, isErrorFollow: false, errorMessageFollow: "" });

    try {
      const response = await axiosInstance.post(`/follow/${id}`);
      set({ followedUsers: response.data, isProcessingFollow: false });
      toast.success("User followed successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error following user";
      set({ isProcessingFollow: false, isErrorFollow: true, errorMessageFollow: errorMessage });
      toast.error(errorMessage);
    }
  },

  // Function to unfollow a user
  unfollowUser: async (id) => {
    const { isProcessingFollow } = get();
    if (isProcessingFollow) return;

    set({ isProcessingFollow: true, isErrorFollow: false, errorMessageFollow: "" });

    try {
      const response = await axiosInstance.post(`/unfollow/${id}`);
      set({ followedUsers: response.data, isProcessingFollow: false });
      toast.success("User unfollowed successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error unfollowing user";
      set({ isProcessingFollow: false, isErrorFollow: true, errorMessageFollow: errorMessage });
      toast.error(errorMessage);
    }
  },

  // Function to get the list of followed users
  getFollowedUsers: async () => {
    try {
      const response = await axiosInstance.get("/followed-users");
      set({ followedUsers: response.data });
    } catch (error) {
      toast.error("Error fetching followed users");
    }
  },

  // Function to update stream
  updateStream: async (streamData) => {
    const { isProcessingStream } = get();
    if (isProcessingStream) return;

    set({ isProcessingStream: true, isErrorStream: false, errorMessageStream: "" });

    try {
      const response = await axiosInstance.post("/stream/update", streamData);
      set({ streamData: response.data, isProcessingStream: false });
      toast.success("Stream updated successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating stream";
      set({ isProcessingStream: false, isErrorStream: true, errorMessageStream: errorMessage });
      toast.error(errorMessage);
    }
  },

  // Function to get the list of streams
  getStreams: async () => {
    try {
      const response = await axiosInstance.get("/streams");
      console.log(response.data);
      set({ streams: response.data });
    } catch (error) {
      toast.error("Error fetching streams");
    }
  },

  // Function to search streams
  searchStreams: async (query) => {
    try {
      const response = await axiosInstance.get(`/search-streams?q=${query}`);
      set({ streams: response.data });
    } catch (error) {
      toast.error("Error searching streams");
    }
  },

  // Function to create viewer token
  createViewerToken: async (hostIdentity) => {
    try {
      const response = await axiosInstance.get(`/livekit/create-viewer-token/${hostIdentity}`);
      set({ viewerToken: response.data });
    } catch (error) {
      toast.error("Error creating viewer token");
    }
  },

  // Reset state
  reset: () => set({
    blockedUsers: null,
    followedUsers: null,
    streamData: null, // Reset single stream
    streams: [], // Reset multiple streams
    isProcessingBlock: false,
    isProcessingFollow: false,
    isProcessingStream: false,
    isErrorBlock: false,
    isErrorFollow: false,
    isErrorStream: false,
    errorMessageBlock: "",
    errorMessageFollow: "",
    errorMessageStream: "",
    isProcessingUpdate: false,
    isErrorUpdate: false,
    errorMessageUpdate: "",
    isBlocked: false,
    viewerToken:"",
    isStoppingStream: false,
    isErrorStoppingStream: false,
    errorMessageStoppingStream: "",
  }),
}));

export default useLiveStreamStore;
