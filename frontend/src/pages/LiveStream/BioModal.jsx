import { useState, useTransition, useRef, useEffect } from "react";
import useLiveStreamStore from "../../stores/useLiveStreamStore";

export const BioModal = ({ initialHeadline, initialAbout, onClose }) => {
  const closeRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [headline, setHeadline] = useState(initialHeadline || "");
  const [about, setAbout] = useState(initialAbout || "");

  // Access the Zustand store's functions and state
  const { updateUserHeadlineAndAbout, isProcessingUpdate, isErrorUpdate, errorMessageUpdate } = useLiveStreamStore();

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();

    // If update is already processing, prevent submitting
    if (isProcessingUpdate) return;

    startTransition(() => {
      updateUserHeadlineAndAbout(headline, about);
    });
  };

  // Show error messages if there is an error
  useEffect(() => {
    if (isErrorUpdate) {
      // You can use any alert or UI component here to display the error
      alert(errorMessageUpdate || "Something went wrong while updating.");
    }
  }, [isErrorUpdate, errorMessageUpdate]);

  // Close the modal when Cancel is clicked
  const handleCancel = () => {
    if (onClose) {
      onClose(); // Call the onClose function passed from parent component
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Edit user profile</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700">Headline</label>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isPending || isProcessingUpdate}
              placeholder="Enter your headline"
            />
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
            <textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
              rows="4"
              disabled={isPending || isProcessingUpdate}
              placeholder="Tell us something about you"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              ref={closeRef}
              type="button"
              onClick={handleCancel} // Close modal on Cancel
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isProcessingUpdate}
              className={`${
                isPending || isProcessingUpdate ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 px-4 rounded-md`}
            >
              {isPending || isProcessingUpdate ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
