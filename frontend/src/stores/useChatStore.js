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

  // Group deletion handler
  deleteGroup: async (groupId) => {
    try {
      // Perform the API request to delete the group
      const response = await axiosInstance.delete(`/group/destroy/${groupId}`);
      toast.success("Group deleted successfully");

      // Optionally update state or fetch the updated list of conversations/groups
      set({ conversations: get().conversations.filter((conv) => conv.id !== groupId) });

      // Optionally emit an event for successful deletion (if needed)
      // emit("group.deleted", groupId);

    } catch (error) {
      const message = error.response?.data?.message || "Error deleting group.";
      toast.error(message);
    }
  },

  // Send message
  sendMessage: async (newMessage, chosenFiles, conversation) => {
    const { messageCreated } = get();
    
    // Prepare FormData for the API call
    const formData = new FormData();
    chosenFiles.forEach((file) => {
      formData.append("attachments[]", file.file);
    });
    formData.append("message", newMessage);
    if (conversation.is_user) {
      formData.append("receiver_id", conversation.id);
    } else if (conversation.is_group) {
      formData.append("group_id", conversation.id);
    }

    try {
      // Replace `route("message.store")` with the actual API endpoint
      const response = await axiosInstance.post("/message/store", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          console.log(progress);
        },
      });

      messageCreated(response.data); // Update the messages in the store
      toast.success("Message sent successfully");
    } catch (error) {
      const message = error?.response?.data?.message || "An error occurred while sending the message";
      toast.error(message);
    }
  },

  // Message deletion handler
  deleteMessage: async (messageId) => {
    set({ isLoading: true, isError: false, errorMessage: '' });
    try {
      // Perform the API request to delete the message
      await axiosInstance.delete(`/messages/${messageId}`);
      
      // Update the localMessages by removing the deleted message
      const { localMessages } = get();
      const updatedMessages = localMessages.filter((message) => message.id !== messageId);
      set({ localMessages: updatedMessages });

      toast.success("Message deleted successfully");

    } catch (error) {
      const message = error.response?.data?.message || "Error deleting message.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
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
  fetchConversationData: async (conversationId, isUser) => {
    set({ isLoading: true, isError: false, errorMessage: '' });
    try {
      // Assuming isUser should be passed as a query parameter
      const response = await axiosInstance.get(`/conversations/${conversationId}/messages`, {
        params: { isUser }  // Pass isUser as a query parameter
      });
      console.log(response.data)
      set({ localMessages: response.data.reverse()});
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
    const { localMessages, noMoreMessages } = get();
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
        toast.success('More messages loaded successfully');

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
