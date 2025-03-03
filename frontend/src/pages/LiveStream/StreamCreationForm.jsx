import React, { useState } from 'react';
import useLiveStreamStore from '../../stores/useLiveStreamStore';

const StreamCreationForm = () => {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null); // Thumbnail is now a file object
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [isChatFollowersOnly, setIsChatFollowersOnly] = useState(false);
  const [isChatDelayed, setIsChatDelayed] = useState(false);

  // Access the `createStream` function and state from Zustand store
  const { createStream, isProcessingStream, errorMessageStream } = useLiveStreamStore();

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Disable submit while processing
      const formData = new FormData();
      formData.append('title', title);
      formData.append('thumbnail', thumbnail); // Add the file to FormData
      formData.append('isChatEnabled', isChatEnabled);
      formData.append('isChatFollowersOnly', isChatFollowersOnly);
      formData.append('isChatDelayed', isChatDelayed);

      // Call the createStream function with the FormData
      await createStream(formData);
    } catch (err) {
      console.error("Error during stream creation:", err);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-transparent shadow-lg rounded-lg border-2 border-white">
      <h2 className="text-3xl font-semibold text-emerald-400 mb-6 text-center">Create Your Live Stream</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stream Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-emerald-400 mb-2">
            Stream Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border-2 border-white rounded-md focus:ring-2 focus:ring-emerald-400 transition duration-300 bg-transparent text-emerald-400"
            required
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="mb-6">
          <label htmlFor="thumbnail" className="block text-sm font-medium text-emerald-400 mb-2">
            Thumbnail (Upload Image)
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*" // Ensures only image files are accepted
            onChange={handleThumbnailChange}
            className="w-full p-4 border-2 border-white rounded-md focus:ring-2 focus:ring-emerald-400 transition duration-300 bg-transparent text-emerald-400"
            required
          />
        </div>

        {/* Chat Settings */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isChatEnabled"
              checked={isChatEnabled}
              onChange={() => setIsChatEnabled(!isChatEnabled)}
              className="h-5 w-5 text-emerald-400 border-white rounded-md"
            />
            <label htmlFor="isChatEnabled" className="text-sm text-emerald-400 ml-3">
              Enable Chat
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isChatFollowersOnly"
              checked={isChatFollowersOnly}
              onChange={() => setIsChatFollowersOnly(!isChatFollowersOnly)}
              className="h-5 w-5 text-emerald-400 border-white rounded-md"
            />
            <label htmlFor="isChatFollowersOnly" className="text-sm text-emerald-400 ml-3">
              Followers Only Chat
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isChatDelayed"
              checked={isChatDelayed}
              onChange={() => setIsChatDelayed(!isChatDelayed)}
              className="h-5 w-5 text-emerald-400 border-white rounded-md"
            />
            <label htmlFor="isChatDelayed" className="text-sm text-emerald-400 ml-3">
              Delayed Chat
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 bg-emerald-400 text-white text-lg font-semibold rounded-md hover:bg-emerald-500 transition duration-300"
            disabled={isProcessingStream} // Disable the button while processing
          >
            {isProcessingStream ? 'Creating Stream...' : 'Create Stream'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMessageStream && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md shadow-md">
          <strong>Error:</strong> {errorMessageStream}
        </div>
      )}
    </div>
  );
};

export default StreamCreationForm;
