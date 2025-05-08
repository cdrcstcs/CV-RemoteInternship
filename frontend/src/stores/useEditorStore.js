import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../lib/axios";

export const useEditorStore = create((set, get) => ({
  layers: [],
  layerComparisonMode: false,
  comparedLayers: [],
  tags: [],
  activeTag: '',
  activeColor: '',
  activeLayer: {
    url: '',
    width: 0,
    height: 0,
    name: "default",
    publicId: "",
    format: "",
    resourceType: "default",
    tags: [],
  },
  removingBackgroundGenerating: false,
  replacingBackgroundGenerating: false,
  extractingImageGenerating: false,
  genFillingGenerating: false,
  genRemovingGenerating: false,
  recoloringImageGenerating: false,
  croppingVideoGenerating: false,
  transcribingGenerating: false,
  uploadingImageGenerating: false,
  uploadingVideoGenerating: false,

  removeBackgroundError: null,
  replaceBackgroundError: null,
  extractImageError: null,
  genFillError: null,
  genRemoveError: null,
  recolorImageError: null,
  cropVideoError: null,
  initiateTranscriptionError: null,
  uploadImageError: null,
  uploadVideoError: null,

  // Remove background
  removeBackground: async (imageUrl, format) => {
    set({ removingBackgroundGenerating: true, removeBackgroundError: null });
    try {
      const response = await axiosInstance.post("/remove-background", { activeImage: imageUrl, format });
      if (response.data.success) {
        toast.success("Background removed successfully!");
        set({ activeLayer: response.data.success });
      } else {
        set({ removeBackgroundError: "Failed to remove background" });
        toast.error("Failed to remove background");
      }
    } catch (e) {
      set({ removeBackgroundError: "Error removing background" });
      toast.error("Error removing background");
      console.error("Error:", e);
    } finally {
      set({ removingBackgroundGenerating: false });
    }
  },

  // Replace background
  replaceBackground: async (imageUrl, prompt = '') => {
    set({ replacingBackgroundGenerating: true, replaceBackgroundError: null });
    try {
      const response = await axiosInstance.post("/replace-background", { activeImage: imageUrl, prompt });
      if (response.data.success) {
        toast.success("Background replaced successfully!");
        set({ activeLayer: response.data.success });
      } else {
        set({ replaceBackgroundError: "Failed to replace background" });
        toast.error("Failed to replace background");
      }
    } catch (e) {
      set({ replaceBackgroundError: "Error replacing background" });
      toast.error("Error replacing background");
      console.error("Error:", e);
    } finally {
      set({ replacingBackgroundGenerating: false });
    }
  },

  // Extract objects
  extractImage: async (imageUrl, prompts, multiple = false, mode = 'default', invert = false, format = 'jpg') => {
    set({ extractingImageGenerating: true, extractImageError: null });
    try {
      const response = await axiosInstance.post("/extract-image", { activeImage: imageUrl, prompts, multiple, mode, invert, format });
      if (response.data.success) {
        toast.success("Image extraction completed!");
        set({ activeLayer: response.data.success });
      } else {
        set({ extractImageError: "Failed to extract objects from image" });
        toast.error("Failed to extract objects from image");
      }
    } catch (e) {
      set({ extractImageError: "Error extracting image" });
      toast.error("Error extracting image");
      console.error("Error:", e);
    } finally {
      set({ extractingImageGenerating: false });
    }
  },

  // Generative fill
  genFill: async (imageUrl, aspect, width, height) => {
    set({ genFillingGenerating: true, genFillError: null });
    try {
      const response = await axiosInstance.post("/gen-fill", { activeImage: imageUrl, aspect, width, height });
      if (response.data.success) {
        toast.success("Generative fill completed!");
        set({ activeLayer: response.data.success });
      } else {
        set({ genFillError: "Failed to generate fill" });
        toast.error("Failed to generate fill");
      }
    } catch (e) {
      set({ genFillError: "Error generating fill" });
      toast.error("Error generating fill");
      console.error("Error:", e);
    } finally {
      set({ genFillingGenerating: false });
    }
  },

  // Generative remove
  genRemove: async (imageUrl, prompt) => {
    set({ genRemovingGenerating: true, genRemoveError: null });
    try {
      const response = await axiosInstance.post("/gen-remove", { activeImage: imageUrl, prompt });
      if (response.data.success) {
        toast.success("Generative remove completed!");
        set({ activeLayer: response.data.success });
      } else {
        set({ genRemoveError: "Failed to generate remove" });
        toast.error("Failed to generate remove");
      }
    } catch (e) {
      set({ genRemoveError: "Error generating remove" });
      toast.error("Error generating remove");
      console.error("Error:", e);
    } finally {
      set({ genRemovingGenerating: false });
    }
  },

  // Recolor image
  recolorImage: async (imageUrl, tag, color) => {
    set({ recoloringImageGenerating: true, recolorImageError: null });
    try {
      const response = await axiosInstance.post("/recolor-image", { activeImage: imageUrl, tag, color });
      if (response.data.success) {
        toast.success("Image recolored successfully!");
        set({ activeLayer: response.data.success });
      } else {
        set({ recolorImageError: "Failed to recolor image" });
        toast.error("Failed to recolor image");
      }
    } catch (e) {
      set({ recolorImageError: "Error recoloring image" });
      toast.error("Error recoloring image");
      console.error("Error:", e);
    } finally {
      set({ recoloringImageGenerating: false });
    }
  },

  // Crop video
  cropVideo: async (videoUrl, aspect, height) => {
    set({ croppingVideoGenerating: true, cropVideoError: null });
    try {
      const response = await axiosInstance.post("/crop-video", { activeVideo: videoUrl, aspect, height });
      if (response.data.success) {
        toast.success("Video cropped successfully!");
        set({ activeLayer: response.data.success });
      } else {
        set({ cropVideoError: "Failed to crop video" });
        toast.error("Failed to crop video");
      }
    } catch (e) {
      set({ cropVideoError: "Error cropping video" });
      toast.error("Error cropping video");
      console.error("Error:", e);
    } finally {
      set({ croppingVideoGenerating: false });
    }
  },

  // Initiate transcription
  initiateTranscription: async (publicId) => {
    set({ transcribingGenerating: true, initiateTranscriptionError: null });
    try {
      const response = await axiosInstance.post("/initiate-transcription", { publicId });
      if (response.data.success) {
        toast.success("Transcription initiated successfully!");
        set({ activeLayer: response.data.subtitledVideoUrl });
      } else {
        set({ initiateTranscriptionError: "Failed to initiate transcription" });
        toast.error("Failed to initiate transcription");
      }
    } catch (e) {
      set({ initiateTranscriptionError: "Error initiating transcription" });
      toast.error("Error initiating transcription");
      console.error("Error:", e);
    } finally {
      set({ transcribingGenerating: false });
    }
  },

  // Upload image
  uploadImage: async (imageFile) => {
    set({ uploadingImageGenerating: true, uploadImageError: null });
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await axiosInstance.post("/upload-image", formData);
      if (response.data.success) {
        toast.success("Image uploaded successfully!");
        set({ activeLayer: response.data.success });
      } else {
        set({ uploadImageError: "Failed to upload image" });
        toast.error("Failed to upload image");
      }
    } catch (e) {
      set({ uploadImageError: "Error uploading image" });
      toast.error("Error uploading image");
      console.error("Error:", e);
    } finally {
      set({ uploadingImageGenerating: false });
    }
  },

  // Upload video
  uploadVideo: async (videoFile) => {
    set({ uploadingVideoGenerating: true, uploadVideoError: null });
    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      const response = await axiosInstance.post("/upload-video", formData);
      if (response.data.success) {
        toast.success("Video uploaded successfully!");
        set({ activeLayer: response.data.success });
      } else {
        set({ uploadVideoError: "Failed to upload video" });
        toast.error("Failed to upload video");
      }
    } catch (e) {
      set({ uploadVideoError: "Error uploading video" });
      toast.error("Error uploading video");
      console.error("Error:", e);
    } finally {
      set({ uploadingVideoGenerating: false });
    }
  },

  // General state setters
  setTags: (tags) => set({ tags }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setActiveColor: (color) => set({ activeColor: color }),

  // Layer management
  addLayer: (layer) => set((state) => ({ layers: [...state.layers, { ...layer }] })),
  removeLayer: (id) => set((state) => ({ layers: state.layers.filter((l) => l.id !== id) })),
  setActiveLayer: (id) => set((state) => ({ activeLayer: state.layers.find((l) => l.id === id) || state.layers[0] })),
  updateLayer: (layer) => set((state) => ({ layers: state.layers.map((l) => (l.id === layer.id ? layer : l)) })),
  setPoster: (id, posterUrl) => set((state) => ({ layers: state.layers.map((l) => (l.id === id ? { ...l, poster: posterUrl } : l)) })),
  setTranscription: (id, transcriptionURL) => set((state) => ({ layers: state.layers.map((l) => (l.id === id ? { ...l, transcriptionURL } : l)) })),

  // Layer comparison
  setLayerComparisonMode: (mode) => set(() => ({ layerComparisonMode: mode, comparedLayers: mode ? [] : [] })),
  setComparedLayers: (layers) => set(() => ({ comparedLayers: layers, layerComparisonMode: layers.length > 0 })),
  toggleComparedLayer: (id) => set((state) => {
    const newComparedLayers = state.comparedLayers.includes(id)
      ? state.comparedLayers.filter((layerId) => layerId !== id)
      : [...state.comparedLayers, id].slice(-2);
    return { comparedLayers: newComparedLayers, layerComparisonMode: newComparedLayers.length > 0 };
  }),
}));
