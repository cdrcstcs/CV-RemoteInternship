import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useSocialMediaStore = create((set, get) => ({
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
  isLoadingConnectionStatus: false,
  isLoadingPost: false,

  isErrorPosts: false,
  isErrorRecommendedUsers: false,
  isErrorConnectionRequests: false,
  isErrorConnections: false,
  isErrorNotifications: false,
  isErrorPost: false,
  isErrorConnectionStatus: false,
  
  errorMessageConnectionStatus: "",
  errorMessage: '',
  errorMessagePost: "",

  // Fetch connection status
  fetchConnectionStatus: async (userId) => {
    set({ isLoadingConnectionStatus: true, isErrorConnectionStatus: false, errorMessageConnectionStatus: "" });
    try {
      const response = await axiosInstance.get(`/connections/status/${userId}`);
      set({ connectionStatus: response.data });
    } catch (error) {
      set({
        isErrorConnectionStatus: true,
        errorMessageConnectionStatus: error.response?.data?.error || "Error fetching connection status",
      });
      toast.error(error.response?.data?.error || "Error fetching connection status");
    } finally {
      set({ isLoadingConnectionStatus: false });
    }
  },

  // Send connection request
  sendConnectionRequest: async (userId) => {
    try {
      await axiosInstance.post(`/connections/request/${userId}`);
      toast.success("Connection request sent successfully");
      // Invalidate or refetch the connection status
      set({ connectionStatus: { status: "pending" } });
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  },

  // Accept connection request
  acceptConnectionRequestForRecommendedUser: async (requestId) => {
    try {
      await axiosInstance.put(`/connections/accept/${requestId}`);
      toast.success("Connection request accepted");
      // Update connection status
      set({ connectionStatus: { status: "connected" } });
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  },

  // Reject connection request
  rejectConnectionRequestForRecommendedUser: async (requestId) => {
    try {
      await axiosInstance.put(`/connections/reject/${requestId}`);
      toast.success("Connection request rejected");
      // Update connection status
      set({ connectionStatus: { status: "not_connected" } });
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  },

  // Fetch single post
  fetchPost: async (postId) => {
    set({ isLoadingPost: true, isErrorPost: false, errorMessagePost: "" });

    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      set({ post: response.data });
    } catch (err) {
      set({ isErrorPost: true, errorMessagePost: err.response?.data?.message || "Error fetching post" });
      toast.error(err.response?.data?.message || "Error fetching post");
    } finally {
      set({ isLoadingPost: false });
    }
  },
  // Create post action
  createPost: async (postData, queryClient) => {
    try {
      const res = await axiosInstance.post("/posts/create", postData);
      toast.success("Post created successfully");
      
      // Invalidate posts query to refresh data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    }
  },
  // Add new actions for post, comment, like and delete
  likePost: async (postId, authUserId) => {
    try {
      await axiosInstance.post(`/posts/${postId}/like`);
      // Optimistically update the posts state after liking
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? { ...post, likes: [...post.likes, authUserId] }
            : post
        ),
      }));
      toast.success("Post liked!");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error liking post.');
    }
  },

  createComment: async (postId, newComment, authUser) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comment`, { content: newComment });
      // Add the new comment to the state
      set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    content: newComment,
                    user: authUser,
                    created_at: new Date(),
                    id: response.data.id,  // Assuming the response contains the new comment's id
                  },
                ],
              }
            : post
        ),
      }));
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding comment.');
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
      toast.error(err.response?.data?.message || 'Error deleting post.');
    }
  },

  // Fetching posts (if required to be used in the store)
  fetchPosts: async () => {
    try {
      const response = await axiosInstance.get('/posts');
      set({ posts: response.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching posts.');
    }
  },
  // Fetch notifications
  fetchNotifications: async () => {
    set({ isLoadingNotifications: true, isErrorNotifications: false, errorMessage: '' });
    try {
      const response = await axiosInstance.get('/notifications');
      set({ notifications: response.data });
    } catch (err) {
      set({ isErrorNotifications: true, errorMessage: err.response?.data?.message || 'Error fetching notifications.' });
      toast.error(err.response?.data?.message || 'Error fetching notifications.');
    } finally {
      set({ isLoadingNotifications: false });
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        ),
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error marking notification as read.');
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((notif) => notif.id !== id),
      }));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error deleting notification.');
    }
  },
  // Fetch posts
  fetchPosts: async () => {
    set({ isLoadingPosts: true, isErrorPosts: false, errorMessage: '' });
    try {
      const response = await axiosInstance.get('/posts');
      set({ posts: response.data });
    } catch (err) {
      set({ isErrorPosts: true, errorMessage: err.response?.data?.message || 'Error fetching posts.' });
      toast.error(err.response?.data?.message || 'Error fetching posts.');
    } finally {
      set({ isLoadingPosts: false });
    }
  },

  // Fetch recommended users
  fetchRecommendedUsers: async () => {
    set({ isLoadingRecommendedUsers: true, isErrorRecommendedUsers: false, errorMessage: '' });
    try {
      const response = await axiosInstance.get('/users/suggestions');
      set({ recommendedUsers: response.data });
    } catch (err) {
      set({ isErrorRecommendedUsers: true, errorMessage: err.response?.data?.message || 'Error fetching recommended users.' });
      toast.error(err.response?.data?.message || 'Error fetching recommended users.');
    } finally {
      set({ isLoadingRecommendedUsers: false });
    }
  },

  // Fetch connection requests
  fetchConnectionRequests: async () => {
    set({ isLoadingConnectionRequests: true, isErrorConnectionRequests: false, errorMessage: '' });
    try {
      const response = await axiosInstance.get('/connections/requests');
      set({ connectionRequests: response.data });
    } catch (err) {
      set({ isErrorConnectionRequests: true, errorMessage: err.response?.data?.message || 'Error fetching connection requests.' });
      toast.error(err.response?.data?.message || 'Error fetching connection requests.');
    } finally {
      set({ isLoadingConnectionRequests: false });
    }
  },

  // Fetch connections
  fetchConnections: async () => {
    set({ isLoadingConnections: true, isErrorConnections: false, errorMessage: '' });
    try {
      const response = await axiosInstance.get('/connections');
      set({ connections: response.data });
    } catch (err) {
      set({ isErrorConnections: true, errorMessage: err.response?.data?.message || 'Error fetching connections.' });
      toast.error(err.response?.data?.message || 'Error fetching connections.');
    } finally {
      set({ isLoadingConnections: false });
    }
  },

  // Accept a connection request
  acceptConnectionRequestForRecommendedUser: async (requestId) => {
    try {
      await axiosInstance.put(`/connections/accept/${requestId}`);
      toast.success("Connection request accepted");
      set((state) => ({
        connectionRequests: state.connectionRequests.filter((request) => request.id !== requestId),
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error accepting connection request.');
    }
  },

  // Reject a connection request
  rejectConnectionRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/connections/reject/${requestId}`);
      toast.success("Connection request rejected");
      set((state) => ({
        connectionRequests: state.connectionRequests.filter((request) => request.id !== requestId),
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error rejecting connection request.');
    }
  },

  // Reset the store
  reset: () => set({
    posts: [],
    recommendedUsers: [],
    connectionRequests: [],
    connections: [],
    isLoadingPosts: false,
    isLoadingRecommendedUsers: false,
    isLoadingConnectionRequests: false,
    isLoadingConnections: false,
    isErrorPosts: false,
    isErrorRecommendedUsers: false,
    isErrorConnectionRequests: false,
    isErrorConnections: false,
    errorMessage: '',
    notifications: [],
    isLoadingNotifications: false,
    isErrorNotifications: false,
  }),
}));

export default useSocialMediaStore;
