import { create } from "zustand";

export const useImageStore = create((set) => ({
  tags: [],
  activeTag: '',
  activeColor: '',
  generating: false,

  // Set tags
  setTags: (tags) => set({ tags }),

  // Set active tag
  setActiveTag: (tag) => set({ activeTag: tag }),

  // Set active color
  setActiveColor: (color) => set({ activeColor: color }),

  // Set generating state
  setGenerating: (generating) => set({ generating }),

  // Reset state to initial values
  reset: () => set({
    tags: [],
    activeTag: '',
    activeColor: '',
    generating: false,
  }),
}));

export default useImageStore;
