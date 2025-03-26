import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "../lib/axios"; // Ensure this is the correct axios instance

export const useEditorStore = create((set, get) => ({
  generating: false,
  uploading: false,
  activeLayer: null,
  layers: [],
  activeTag: "",
  activeColor: "",
  
  // Error variables for each action
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
    set({ generating: true, removeBackgroundError: null }); // Reset the error before making the request
    try {
      const response = await axiosInstance.post("/remove-background", {
        activeImage: imageUrl,
        format: format,
      });

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
      set({ generating: false });
    }
  },

  // Replace background (with or without prompt)
  replaceBackground: async (imageUrl, prompt = '') => {
    set({ generating: true, replaceBackgroundError: null });
    try {
      const response = await axiosInstance.post("/replace-background", {
        activeImage: imageUrl,
        prompt: prompt,
      });

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
      set({ generating: false });
    }
  },

  // Extract objects from image
  extractImage: async (imageUrl, prompts, multiple = false, mode = 'default', invert = false, format = 'jpg') => {
    set({ generating: true, extractImageError: null });
    try {
      const response = await axiosInstance.post("/extract-image", {
        activeImage: imageUrl,
        prompts: prompts,
        multiple: multiple,
        mode: mode,
        invert: invert,
        format: format,
      });

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
      set({ generating: false });
    }
  },

  // Generate fill (aspect ratio and dimensions)
  genFill: async (imageUrl, aspect, width, height) => {
    set({ generating: true, genFillError: null });
    try {
      const response = await axiosInstance.post("/gen-fill", {
        activeImage: imageUrl,
        aspect: aspect,
        width: width,
        height: height,
      });

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
      set({ generating: false });
    }
  },

  // Generate remove (remove an object from the image)
  genRemove: async (imageUrl, prompt) => {
    set({ generating: true, genRemoveError: null });
    try {
      const response = await axiosInstance.post("/gen-remove", {
        activeImage: imageUrl,
        prompt: prompt,
      });

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
      set({ generating: false });
    }
  },

  // Recolor image
  recolorImage: async (imageUrl, tag, color) => {
    set({ generating: true, recolorImageError: null });
    try {
      const response = await axiosInstance.post("/recolor-image", {
        activeImage: imageUrl,
        tag: tag,
        color: color,
      });

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
      set({ generating: false });
    }
  },

  // Crop video
  cropVideo: async (videoUrl, aspect, height) => {
    set({ generating: true, cropVideoError: null });
    try {
      const response = await axiosInstance.post("/crop-video", {
        activeVideo: videoUrl,
        aspect: aspect,
        height: height,
      });

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
      set({ generating: false });
    }
  },

  // Initiate transcription
  initiateTranscription: async (publicId) => {
    set({ generating: true, initiateTranscriptionError: null });
    try {
      const response = await axiosInstance.post("/initiate-transcription", {
        publicId,
      });

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
      set({ generating: false });
    }
  },

  // Upload image to Cloudinary
  uploadImage: async (imageFile) => {
    set({ uploading: true, uploadImageError: null });
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
      set({ uploading: false });
    }
  },

  // Upload video
  uploadVideo: async (videoFile) => {
    set({ generating: true, uploadVideoError: null });
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
      set({ generating: false });
    }
  },
}));
