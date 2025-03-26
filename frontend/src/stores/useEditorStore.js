import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../lib/axios"; // Ensure this is the correct axios instance

export const useEditorStore = create((set, get) => ({
  generating: false,
  activeLayer: null,
  layers: [],
  activeTag: "",
  activeColor: "",

  // Remove background
  removeBackground: async (imageUrl) => {
    set({ generating: true });

    try {
      const response = await axiosInstance.post("/remove-background", {
        imageUrl,
      });

      if (response.data.success) {
        toast.success("Background removed successfully!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to remove background");
      }
    } catch (e) {
      toast.error("Error removing background");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },

  // Replace background
  replaceBackground: async (imageUrl, newBackgroundUrl) => {
    set({ generating: true });

    try {
      const response = await axiosInstance.post("/replace-background", {
        imageUrl,
        newBackgroundUrl,
      });

      if (response.data.success) {
        toast.success("Background replaced successfully!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to replace background");
      }
    } catch (e) {
      toast.error("Error replacing background");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },

  // Extract image
  extractImage: async (imageUrl) => {
    set({ generating: true });

    try {
      const response = await axiosInstance.post("/extract-image", {
        imageUrl,
      });

      if (response.data.success) {
        toast.success("Image extracted successfully!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to extract image");
      }
    } catch (e) {
      toast.error("Error extracting image");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },

  // Generate fill
  genFill: async (imageUrl, width, height) => {
    set({ generating: true });

    try {
      const response = await axiosInstance.post("/gen-fill", {
        imageUrl,
        width,
        height,
      });

      if (response.data.success) {
        toast.success("Generative fill completed!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to generate fill");
      }
    } catch (e) {
      toast.error("Error generating fill");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },

  // Generate remove (remove an object from the image)
  genRemove: async (imageUrl, prompt) => {
    set({ generating: true });

    try {
      const response = await axiosInstance.post("/gen-remove", {
        imageUrl,
        prompt,
      });

      if (response.data.success) {
        toast.success("Generative remove completed!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to generate remove");
      }
    } catch (e) {
      toast.error("Error generating remove");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },

  // Recolor image
  recolorImage: async (imageUrl, color) => {
    set({ generating: true });

    try {
      const response = await axiosInstance.post("/recolor-image", {
        imageUrl,
        color,
      });

      if (response.data.success) {
        toast.success("Image recolored successfully!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to recolor image");
      }
    } catch (e) {
      toast.error("Error recoloring image");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },

  // Crop video
  cropVideo: async (videoUrl, startTime, endTime) => {
    set({ generating: true });

    try {
      const response = await axiosInstance.post("/crop-video", {
        videoUrl,
        startTime,
        endTime,
      });

      if (response.data.success) {
        toast.success("Video cropped successfully!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to crop video");
      }
    } catch (e) {
      toast.error("Error cropping video");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },

  // Initiate transcription
  initiateTranscription: async (videoUrl) => {
    set({ generating: true });

    try {
      const response = await axiosInstance.post("/initiate-transcription", {
        videoUrl,
      });

      if (response.data.success) {
        toast.success("Transcription initiated successfully!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to initiate transcription");
      }
    } catch (e) {
      toast.error("Error initiating transcription");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },

  // Upload video
  uploadVideo: async (videoFile) => {
    set({ generating: true });

    try {
      const formData = new FormData();
      formData.append("video", videoFile);

      const response = await axiosInstance.post("/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Video uploaded successfully!");
        set({ activeLayer: response.data.success });
      } else {
        toast.error("Failed to upload video");
      }
    } catch (e) {
      toast.error("Error uploading video");
      console.error("Error:", e);
    } finally {
      set({ generating: false });
    }
  },
}));
