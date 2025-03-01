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

  // LiveKit-related state
  ingressData: null,
  isProcessingIngress: false,
  isErrorIngress: false,
  errorMessageIngress: "",

  // Stream-related state
  streamData: null,
  isProcessingStream: false,
  isErrorStream: false,
  errorMessageStream: "",

  // Update-related state
  isProcessingUpdate: false,
  isErrorUpdate: false,
  errorMessageUpdate: "",

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
      return response.data; // Return directly to be used in the component
    } catch (error) {
      toast.error("Error checking if user is blocked");
      return false;
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

  // Function to create ingress for live stream
  createIngress: async (ingressType) => {
    const { isProcessingIngress } = get();
    if (isProcessingIngress) return;

    set({ isProcessingIngress: true, isErrorIngress: false, errorMessageIngress: "" });

    try {
      const response = await axiosInstance.post(`/livekit/create-ingress/${ingressType}`);
      set({ ingressData: response.data, isProcessingIngress: false });
      toast.success("Ingress created successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error creating ingress";
      set({ isProcessingIngress: false, isErrorIngress: true, errorMessageIngress: errorMessage });
      toast.error(errorMessage);
    }
  },

  // Function to create stream token
  createStreamToken: async (roomName) => {
    try {
      const response = await axiosInstance.get(`/livekit/create-token/${roomName}`);
      return response.data; // Return directly to be used in the component
    } catch (error) {
      toast.error("Error creating stream token");
      return null;
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
      set({ streamData: response.data });
    } catch (error) {
      toast.error("Error fetching streams");
    }
  },

  // Function to search streams
  searchStreams: async (query) => {
    try {
      const response = await axiosInstance.get(`/search-streams?q=${query}`);
      return response.data; // Return directly to be used in the component
    } catch (error) {
      toast.error("Error searching streams");
      return [];
    }
  },

  // Function to create viewer token
  createViewerToken: async (hostIdentity) => {
    try {
      const response = await axiosInstance.get(`/livekit/create-viewer-token/${hostIdentity}`);
      return response.data; // Return directly to be used in the component
    } catch (error) {
      toast.error("Error creating viewer token");
      return null;
    }
  },

  // Reset state
  reset: () => set({
    blockedUsers: null,
    followedUsers: null,
    ingressData: null,
    streamData: null,
    isProcessingBlock: false,
    isProcessingFollow: false,
    isProcessingIngress: false,
    isProcessingStream: false,
    isErrorBlock: false,
    isErrorFollow: false,
    isErrorIngress: false,
    isErrorStream: false,
    errorMessageBlock: "",
    errorMessageFollow: "",
    errorMessageIngress: "",
    errorMessageStream: "",
    isProcessingUpdate: false,
    isErrorUpdate: false,
    errorMessageUpdate: "",
  }),
}));

export default useLiveStreamStore;
