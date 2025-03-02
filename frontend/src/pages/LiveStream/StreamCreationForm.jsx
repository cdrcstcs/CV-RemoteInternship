import React, { useState } from 'react';
import useLiveStreamStore from '../../stores/useLiveStreamStore';
const StreamCreationForm = () => {
  const [title, setTitle] = useState('');
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [isChatFollowersOnly, setIsChatFollowersOnly] = useState(false);
  const [isChatDelayed, setIsChatDelayed] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Access the `createStream` function and state from Zustand store
  const { createStream, isProcessingStream, errorMessageStream } = useLiveStreamStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if the stream creation is already in process
    if (isProcessingStream) {
      setError("Stream creation is already in progress.");
      return;
    }

    try {
      // Call the createStream function from Zustand store
      await createStream();
      setMessage("Stream created successfully!");
    } catch (err) {
      setError(errorMessageStream || 'Failed to create stream');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Stream</h2>
      
      {message && <div className="bg-green-200 text-green-800 p-4 mb-4">{message}</div>}
      {error && <div className="bg-red-200 text-red-800 p-4 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Stream Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isChatEnabled"
            checked={isChatEnabled}
            onChange={() => setIsChatEnabled(!isChatEnabled)}
            className="mr-2"
          />
          <label htmlFor="isChatEnabled" className="text-sm text-gray-700">
            Enable Chat
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isChatFollowersOnly"
            checked={isChatFollowersOnly}
            onChange={() => setIsChatFollowersOnly(!isChatFollowersOnly)}
            className="mr-2"
          />
          <label htmlFor="isChatFollowersOnly" className="text-sm text-gray-700">
            Followers Only Chat
          </label>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isChatDelayed"
            checked={isChatDelayed}
            onChange={() => setIsChatDelayed(!isChatDelayed)}
            className="mr-2"
          />
          <label htmlFor="isChatDelayed" className="text-sm text-gray-700">
            Delayed Chat
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={isProcessingStream}
        >
          {isProcessingStream ? 'Creating Stream...' : 'Create Stream'}
        </button>
      </form>
    </div>
  );
};

export default StreamCreationForm;
