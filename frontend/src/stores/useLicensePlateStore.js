import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast is used for toast notifications

export const useLicensePlateStore = create((set) => ({
  licensePlates: [], // Array to store multiple license plates
  isLoading: false,
  isError: false,
  errorMessage: '',

  // Function to process the image and get the license plates
  processLicensePlate: async (image) => {
    set({ isLoading: true, isError: false, errorMessage: '' }); // Start loading

    try {
      // Create FormData to send the image as a file to the backend
      const formData = new FormData();
      formData.append('image', dataURLtoFile(image, 'captured.jpg')); // Append image as 'image' field

      // Make the POST request to the backend (Laravel)
      const response = await axiosInstance.post('/process-license-plate',formData);

      // Assuming the backend returns a response with the 'license_plate_results' array
      const { license_plate_results } = response.data;
      if (license_plate_results && license_plate_results.length > 0) {
        set({ licensePlates: license_plate_results });
      } else {
        set({ licensePlates: [] });
      }
    } catch (error) {
      console.error('Error calling backend:', error);
      set({ isError: true, errorMessage: 'Error with OCR' });
      toast.error('Error processing the image');
    } finally {
      set({ isLoading: false }); // End loading
    }
  },

  // Reset the state if needed
  reset: () => set({ licensePlates: [], isLoading: false, isError: false, errorMessage: '' }),
}));

// Utility function to convert Base64 image to File
const dataURLtoFile = (dataurl, filename) => {
  const [meta, base64] = dataurl.split(',');
  const mime = meta.match(/:(.*?);/)[1];
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], filename, { type: mime });
};

export default useLicensePlateStore;
