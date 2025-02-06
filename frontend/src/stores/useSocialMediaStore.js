import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

const handleError = (error, set, stateKey, errorMessage) => {
  const message = error.response?.data?.message || errorMessage;
  set({ [stateKey]: true, [`${stateKey}Message`]: message });
  toast.error(message);
};

export const useSocialMediaStore = create((set, get) => ({
  posts: [],
  recommendedUsers: [],
  connectionRequests: [],
  connections: [],
  notifications: [],
  post: null,
  connectionStatus: null,

  // Loading States
  isLoadingPosts: false,
  isLoadingRecommendedUsers: false,
  isLoadingConnectionRequests: false,
  isLoadingConnections: false,
  isLoadingNotifications: false,
  isLoadingPost: false,
  isLoadingConnectionStatus: false,

  // Error States
  isErrorPosts: false,
  isErrorRecommendedUsers: false,
  isErrorConnectionRequests: false,
  isErrorConnections: false,
  isErrorNotifications: false,
  isErrorPost: false,
  isErrorConnectionStatus: false,
  errorMessage: "",
  errorMessagePost: "",
  errorMessageConnectionStatus: "",

  // Fetch functions
  fetchPosts: async () => {
    set({ isLoadingPosts: true, isErrorPosts: false, errorMessage: "" });
    try {
      const response = await axiosInstance.get("/posts");
      set({ posts: response.data });
    } catch (err) {
      handleError(err, set, 'isErrorPosts', 'Error fetching posts.');
    } finally {
      set({ isLoadingPosts: false });
    }
  },

  fetchRecommendedUsers: async () => {
    set({ isLoadingRecommendedUsers: true, isErrorRecommendedUsers: false, errorMessage: "" });
    try {
      const response = await axiosInstance.get("/users/suggestions");
      set({ recommendedUsers: response.data });
    } catch (err) {
      handleError(err, set, 'isErrorRecommendedUsers', 'Error fetching recommended users.');
    } finally {
      set({ isLoadingRecommendedUsers: false });
    }
  },

  fetchConnectionRequests: async () => {
    set({ isLoadingConnectionRequests: true, isErrorConnectionRequests: false, errorMessage: "" });
    try {
      const response = await axiosInstance.get("/connections/requests");
      set({ connectionRequests: response.data });
    } catch (err) {
      handleError(err, set, 'isErrorConnectionRequests', 'Error fetching connection requests.');
    } finally {
      set({ isLoadingConnectionRequests: false });
    }
  },

  fetchConnections: async () => {
    set({ isLoadingConnections: true, isErrorConnections: false, errorMessage: "" });
    try {
      const response = await axiosInstance.get("/connections");
      set({ connections: response.data });
    } catch (err) {
      handleError(err, set, 'isErrorConnections', 'Error fetching connections.');
    } finally {
      set({ isLoadingConnections: false });
    }
  },

  fetchNotifications: async () => {
    set({ isLoadingNotifications: true, isErrorNotifications: false, errorMessage: "" });
    try {
      const response = await axiosInstance.get("/notifications");
      set({ notifications: response.data });
    } catch (err) {
      handleError(err, set, 'isErrorNotifications', 'Error fetching notifications.');
    } finally {
      set({ isLoadingNotifications: false });
    }
  },

  fetchConnectionStatus: async (userId) => {
    set({ isLoadingConnectionStatus: true, isErrorConnectionStatus: false, errorMessageConnectionStatus: "" });
    try {
      const response = await axiosInstance.get(`/connections/status/${userId}`);
      set({ connectionStatus: response.data });
    } catch (error) {
      handleError(error, set, 'isErrorConnectionStatus', 'Error fetching connection status');
    } finally {
      set({ isLoadingConnectionStatus: false });
    }
  },

  // Post and comment functions
  createPost: async (postData, queryClient) => {
    try {
      const res = await axiosInstance.post("/posts/create", postData);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    }
  },

  fetchPost: async (postId) => {
    set({ isLoadingPost: true, isErrorPost: false, errorMessagePost: "" });
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      set({ post: response.data });
    } catch (err) {
      handleError(err, set, 'isErrorPost', 'Error fetching post');
    } finally {
      set({ isLoadingPost: false });
    }
  },

  likePost: async (postId, authUserId) => {
    try {
      await axiosInstance.post(`/posts/${postId}/like`);
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, likes: [...post.likes, authUserId] } : post
        ),
      }));
      toast.success("Post liked!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error liking post.");
    }
  },

  createComment: async (postId, newComment, authUser) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comment`, { content: newComment });
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, comments: [...post.comments, { ...response.data, user: authUser }] }
            : post
        ),
      }));
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding comment.");
    }
  },

  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/posts/delete/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
      }));
      toast.success("Post deleted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting post.");
    }
  },

  // Connection request functions
  sendConnectionRequest: async (userId) => {
    try {
      await axiosInstance.post(`/connections/request/${userId}`);
      toast.success("Connection request sent successfully");
      set({ connectionStatus: { status: "pending" } });
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  },

  acceptConnectionRequestForRecommendedUser: async (requestId) => {
    try {
      await axiosInstance.put(`/connections/accept/${requestId}`);
      toast.success("Connection request accepted");
      set({ connectionStatus: { status: "connected" } });
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  },

  rejectConnectionRequestForRecommendedUser: async (requestId) => {
    try {
      await axiosInstance.put(`/connections/reject/${requestId}`);
      toast.success("Connection request rejected");
      set({ connectionStatus: { status: "not_connected" } });
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  },

  // Notifications functions
  markAsRead: async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        ),
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Error marking notification as read.");
    }
  },

  deleteNotification: async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((notif) => notif.id !== id),
      }));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error deleting notification.");
    }
  },

  // Reset the store
  reset: () => set({
    posts: [],
    recommendedUsers: [],
    connectionRequests: [],
    connections: [],
    notifications: [],
    post: null,
    connectionStatus: null,

    isLoadingPosts: false,
    isLoadingRecommendedUsers: false,
    isLoadingConnectionRequests: false,
    isLoadingConnections: false,
    isLoadingNotifications: false,
    isLoadingPost: false,
    isLoadingConnectionStatus: false,

    isErrorPosts: false,
    isErrorRecommendedUsers: false,
    isErrorConnectionRequests: false,
    isErrorConnections: false,
    isErrorNotifications: false,
    isErrorPost: false,
    isErrorConnectionStatus: false,

    errorMessage: '',
    errorMessagePost: '',
    errorMessageConnectionStatus: '',
  }),
}));

export default useSocialMediaStore;
