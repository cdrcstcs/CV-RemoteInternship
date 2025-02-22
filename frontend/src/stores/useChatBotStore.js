import { create } from "zustand";
import axiosInstance from "../lib/axios"; // Assuming you have axiosInstance configured
import { toast } from "react-hot-toast";

// Define the store
export const useChatBotStore = create((set) => ({
  chats: [], // Store the chat data here
  chat: null, // Store the current chat data
  isLoading: false,
  isError: false,
  errorMessage: "",
  chatbotContext: null, // Store the chatbot context data
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
  createChat: async (text, navigate) => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
      const response = await axiosInstance.post("/chats",{ text });
      const chat = response.data;
      set((state) => ({ chats: [...state.chats, chat] }));
      toast.success("Chat created successfully!");
      navigate(`/chatbot/chats/${chat.id}`);
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
    } catch (err) {
      const message = err.response?.data?.message || "Error updating chat.";
      set({ isError: true, errorMessage: message });
      toast.error(message);
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchChatbotContext: async () => {
    set({ isLoading: true, isError: false, errorMessage: "" });
    try {
        const response = await axiosInstance.get("/chatbot/context"); // Adjust API endpoint as necessary
        const contextData = response.data;

        let cumulativeText = ""; // Initialize the cumulativeText

        // Arrays to store unique values
        const uniqueComments = new Set();
        const uniqueCoupons = new Set();
        const uniquePosts = new Set();
        const uniqueProducts = new Set();
        const uniqueRoles = new Set();

        // Check if contextData is an object and process it
        if (typeof contextData === "object" && contextData !== null) {
            // Loop through each key in the contextData object
            Object.keys(contextData).forEach((key) => {
                const data = contextData[key];

                // Process comments if available (limit to first 50)
                if (key === 'comments' && Array.isArray(data)) {
                    data.slice(0, 50).forEach((c) => { // Limit to first 50 comments
                        if (!uniqueComments.has(c.content)) {
                            uniqueComments.add(c.content);  // Add to the Set to ensure uniqueness
                            cumulativeText += " " + c.content;
                        }
                    });
                }

                // Process coupons if available (limit to first 50)
                if (key === 'coupons' && Array.isArray(data)) {
                    data.slice(0, 50).forEach((c) => { // Limit to first 50 coupons
                        if (!uniqueCoupons.has(c.discount)) {
                            uniqueCoupons.add(c.discount);  // Add to the Set to ensure uniqueness
                            cumulativeText += " " + c.discount;
                        }
                    });
                }

                // Process posts if available (limit to first 50)
                if (key === 'posts' && Array.isArray(data)) {
                    data.slice(0, 50).forEach((p) => { // Limit to first 50 posts
                        if (!uniquePosts.has(p.content)) {
                            uniquePosts.add(p.content);  // Add to the Set to ensure uniqueness
                            cumulativeText += " " + p.content;
                        }
                    });
                }

                // Process products if available (limit to first 50)
                if (key === 'products' && Array.isArray(data)) {
                    data.slice(0, 50).forEach((p) => { // Limit to first 50 products
                        if (!uniqueProducts.has(p.description)) {
                            uniqueProducts.add(p.description);  // Add to the Set to ensure uniqueness
                            cumulativeText += " " + p.description;
                        }
                    });
                }

                // Process roles if available (limit to first 50)
                if (key === 'roles' && Array.isArray(data)) {
                    data.slice(0, 50).forEach((r) => { // Limit to first 50 roles
                        const roleDescription = r.role_name + " " + r.description;
                        if (!uniqueRoles.has(roleDescription)) {
                            uniqueRoles.add(roleDescription);  // Add to the Set to ensure uniqueness
                            cumulativeText += " " + roleDescription;
                        }
                    });
                }
            });

            console.log(cumulativeText.trim());

            set({ chatbotContext: cumulativeText.trim() });
            
            toast.success("Chatbot context loaded successfully!");
        } else {
            // Handle the case where contextData is not a valid object
            toast.error("Invalid data format received from server.");
            console.error("Received invalid data format: ", contextData);
        }
        } catch (err) {
            const message = err.response?.data?.message || "Error fetching chatbot context.";
            set({ isError: true, errorMessage: message });
            toast.error(message);
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
    chatbotContext: null, // Reset chatbot context as well
  }),
}));

export default useChatBotStore;
