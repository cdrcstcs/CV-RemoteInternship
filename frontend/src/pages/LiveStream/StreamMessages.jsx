import React, { useState, useEffect } from "react";
import { FaceSmileIcon, PaperAirplaneIcon, ClockIcon } from "@heroicons/react/24/solid";
import EmojiPicker from "emoji-picker-react"; // Import the emoji picker
import { Popover } from "@headlessui/react";
import useStreamMessageStore from "../../stores/useStreamMessageStore";

// Accept creatorId, viewerId, and streamId as props
const StreamMessages = ({ creatorId, viewerId, streamId }) => {
  const [message, setMessage] = useState("");
  
  // Access store state and actions from Zustand
  const {
    listenForNewMessage,
    messages,
    isProcessingMessage,
    isErrorMessage,
    errorMessageMessage,
    isSuccessMessage,
    sendMessage,
    getMessagesByCreator,
    reset,
  } = useStreamMessageStore();


  useEffect(() => {
    listenForNewMessage(streamId);
  }, [streamId]);

  useEffect(() => {
    if (creatorId) {
      // Call the getMessagesByCreator function to fetch messages
      getMessagesByCreator(creatorId);
    }
  }, [creatorId, getMessagesByCreator]);

  // Handler for sending the message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Ensure the message is provided
    if (!message) {
      return;
    }

    // Send the message with creatorId, viewerId, and streamId as URL parameters
    await sendMessage(message, creatorId, viewerId, streamId);
  };

  // Effect to reset store on component unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Handler to add emoji to the message input
  const onEmojiClick = (emojiData) => {
    // Append the emoji to the current message
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg border-2 border-white flex flex-col" style={{ height: 690 }}>
      {/* Displaying error if any */}
      {isErrorMessage && console.log(errorMessageMessage)}

      
      <div className="flex-1 overflow-auto space-y-4">
        {messages.length > 0 ? (
          <ul className="space-y-2">
            {messages.map((msg) => (
              <li key={msg.id} className="bg-transparent text-emerald-400 p-4 border-2 border-white rounded-md shadow-sm">
                <strong>{msg.viewer.last_name + " " + msg.viewer.first_name}</strong>: {msg.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-emerald-400">No messages found.</p>
        )}
      </div>

      {/* Display success message */}
      {isSuccessMessage && console.log(isSuccessMessage)}


      {/* Send message form */}
      <form onSubmit={handleSendMessage} className="space-y-4 mt-6">
        <div>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            required
            className="w-full p-2 border-2 border-white text-emerald-400 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Send Button */}
          {/* Emoji Picker */}
          <Popover className="relative">
                <Popover.Button className="p-1 text-emerald-400 hover:text-emerald-500">
                <FaceSmileIcon className="w-6 h-6" />
                </Popover.Button>
                <Popover.Panel className="absolute z-10 right-0 bottom-full">
                <EmojiPicker
                    theme="dark"
                    onEmojiClick={onEmojiClick} // Add emoji to message when clicked
                />
                </Popover.Panel>
            </Popover>

            <button
            type="submit"
            disabled={isProcessingMessage}
            className={`py-2 px-4 rounded-md font-semibold text-white ${isProcessingMessage ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-400 hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-400"}`}
            >
            {/* Conditional rendering based on isProcessingMessage */}
            {isProcessingMessage ? (
                <ClockIcon className="w-5 h-5 animate-spin" />
            ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
            )}
            </button>

        </div>
      </form>
    </div>
  );
};

export default StreamMessages;
