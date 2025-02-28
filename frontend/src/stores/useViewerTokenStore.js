import { create } from "zustand";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { createViewerToken } from "@/actions/token";

export const useViewerTokenStore = create((set, get) => ({
  token: "",
  name: "",
  identity: "",
  
  fetchViewerToken: async (hostIdentity) => {
    set({ token: "", name: "", identity: "" });  // Reset state before fetching

    try {
      const viewerToken = await createViewerToken(hostIdentity);
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
    }
  },
}));
