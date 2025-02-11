// useChatStore.js
import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useChatStore = create((set, get) => ({
  conversations: [],
  selectedConversation: null,
  localMessages: [],
  noMoreMessages: false,
  scrollFromBottom: 0,
  isLoading: false,
  isError: false,
  errorMessage: '',

  blockUser: async (conversationId, blockedAt) => {
    try {
      // Check if the user is blocked or not to decide on the action
      const action = blockedAt ? 'unblock' : 'block';
      const url = `/user/${action}/${conversationId}`;  // Direct endpoint URL
      
      const response = await axiosInstance.post(url);
      
      toast.success(response.data.message);
      
      // Optionally update the state to reflect the change
      set((state) => ({
        conversations: state.conversations.map(convo =>
          convo.id === conversationId
            ? { ...convo, blocked_at: blockedAt ? null : new Date() } // Update blocked_at field
            : convo
        ),
      }));
    } catch (err) {
      const message = err.response?.data?.message || "Error processing user block/unblock request.";
      toast.error(message);
    }
  },
  createOrUpdateGroup: async (data, groupId = null) => {
    try {
      const response = groupId
        ? await axiosInstance.put(`/group/update/${groupId}`, data) // Update group
        : await axiosInstance.post("/group/store", data); // Create new group
        
      // Assuming response.data contains the group data
      toast.success(`Group "${data.name}" ${groupId ? 'updated' : 'created'}`);
      // Optionally update state with the new group data, e.g. by fetching updated conversations.
    } catch (err) {
      const message = err.response?.data?.message || "Error processing group request.";
      toast.error(message);
    }
  },
  // Fetch conversations
  fetchConversations: async () => {
    set({ isLoading: true, isError: false, errorMessage: '' });
    try {
      const response = await axiosInstance.get("/user/conversations");
      console.log(response.data)
      set({ conversations: response.data });
    } catch (error) {
      const message = error.response?.data?.message || "Error fetching conversations.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch conversation data
  fetchConversationData: async (conversationId) => {
    set({ isLoading: true, isError: false, errorMessage: '' });
    try {
      const response = await axiosInstance.get(`/conversations/${conversationId}/messages`);
      set({ localMessages: response.data.messages.reverse() });
    } catch (error) {
      const message = error.response?.data?.message || "Error fetching conversation data.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Message creation handler
  messageCreated: (message) => {
    const { selectedConversation, localMessages } = get();
    if (selectedConversation) {
      if (
        selectedConversation.is_group && selectedConversation.id === message.group_id
      ) {
        set({ localMessages: [...localMessages, message] });
      } else if (
        selectedConversation.is_user &&
        (selectedConversation.id === message.sender_id || selectedConversation.id === message.receiver_id)
      ) {
        set({ localMessages: [...localMessages, message] });
      }
    }
  },

  // Message deletion handler
  messageDeleted: (message) => {
    const { selectedConversation, localMessages } = get();
    if (selectedConversation) {
      const updatedMessages = localMessages.filter(m => m.id !== message.id);
      set({ localMessages: updatedMessages });
    }
  },

  // Load more messages
  loadMoreMessages: async () => {
    const { localMessages, noMoreMessages, scrollFromBottom } = get();
    if (noMoreMessages) return;

    const firstMessage = localMessages[0];
    try {
      const { data } = await axiosInstance.get(`/messages/load-older/${firstMessage.id}`);
      if (data.length === 0) {
        set({ noMoreMessages: true });
      } else {
        const scrollHeight = document.querySelector('.messages-container').scrollHeight;
        const scrollTop = document.querySelector('.messages-container').scrollTop;
        const clientHeight = document.querySelector('.messages-container').clientHeight;
        const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;

        set({ scrollFromBottom: tmpScrollFromBottom });
        set({ localMessages: [...data.reverse(), ...localMessages] });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error loading older messages.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
    }
  },

  // Set selected conversation
  setSelectedConversation: (conversation) => {
    set({ selectedConversation: conversation, noMoreMessages: false, scrollFromBottom: 0 });
  },

  // Reset store (optional)
  reset: () => set({
    conversations: [],
    selectedConversation: null,
    localMessages: [],
    noMoreMessages: false,
    scrollFromBottom: 0,
    isLoading: false,
    isError: false,
    errorMessage: '',
  }),
}));

export default useChatStore;
