import { create } from "zustand";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../lib/axios"; // Ensure this is the correct axios instance

export const useViewerTokenStore = create((set, get) => ({
  token: "",
  name: "",
  identity: "",
  
  fetchViewerToken: async (hostIdentity) => {
    set({ token: "", name: "", identity: "" });  // Reset state before fetching

    try {
      // Make a GET request to fetch the viewer token, passing hostIdentity as a query parameter
      const response = await axiosInstance.get(`/livekit/create-viewer-token`, {
        params: { hostIdentity } // Pass hostIdentity as a query parameter
      });

      const viewerToken = response.data;

      set({ token: viewerToken });

      const decodedToken = jwtDecode(viewerToken);
      const name = decodedToken?.name;
      const identity = decodedToken?.jti;

      if (identity) {
        set({ identity });
      }
      if (name) {
        set({ name });
      }
    } catch (e) {
      toast.error("Failed to create token");
      console.error("Error fetching viewer token:", e); // Log the error for debugging
    }
  },
}));
