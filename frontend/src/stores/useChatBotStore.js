import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Assuming you have axiosInstance configured
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// Define the store
export const useChatBotStore = create((set) => ({
  chats: [], // Store the chat data here
  chat: null, // Store the current chat data
  isLoading: false,
  isError: false,
  errorMessage: "",

  // Fetch user chats
  fetchUserChats: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      const response = await axiosInstance.get("/userchats");
      const chats = response.data;
      set({ chats });
    } catch (err) {
      const message = err.response?.data?.message || "Error fetching chats.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new chat
  createChat: async (text) => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      const navigate = useNavigate();
      const response = await axiosInstance.post("/chats",{ text });
      const chat = response.data;
      set((state) => ({ chats: [...state.chats, chat] }));
      toast.success("Chat created successfully!");
      navigate(`/chatbot/chats/${chat._id}`);
    } catch (err) {
      const message = err.response?.data?.message || "Error creating chat.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a specific chat
  fetchChat: async (chatId) => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      const response = await axiosInstance.get(`/chats/${chatId}`);
      const chat = response.data;
      set({ chat });
    } catch (err) {
      const message = err.response?.data?.message || "Error fetching chat.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Update an existing chat
  updateChat: async (chatId, question, answer) => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      const response = await axiosInstance.put(`/chats/${chatId}`,{ question, answer });
      const updatedChat = response.data;
      toast.success("Chat updated successfully!");
      return updatedChat;
    } catch (err) {
      const message = err.response?.data?.message || "Error updating chat.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Reset store state
  reset: () => set({
    chats: [],
    chat: null,
    isLoading: false,
    isError: false,
    errorMessage: "",
  }),
}));

export default useChatBotStore;
