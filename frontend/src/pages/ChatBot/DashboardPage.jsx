import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatBotStore } from "../../stores/useChatBotStore"; // Import the Zustand store

const DashboardPage = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  // Get the necessary state and actions from your Zustand store
  const { createChat, isLoading } = useChatBotStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    createChat(text, navigate); // Call the createChat action from the store
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-col items-center justify-center flex-1 w-1/2 gap-12">
        <div className="flex items-center gap-5 opacity-20">
          <img src="/logo.png" alt="" className="w-16 h-16" />
          <h1 className="text-6xl bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent">
            LAMA AI
          </h1>
        </div>
        <div className="flex items-center justify-between w-full gap-12">
          <div className="flex-1 flex flex-col gap-2 font-light text-sm p-5 border border-[#555] rounded-3xl">
            <img src="/chat.png" alt="" className="w-10 h-10 object-cover" />
            <span>Create a New Chat</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 font-light text-sm p-5 border border-[#555] rounded-3xl">
            <img src="/image.png" alt="" className="w-10 h-10 object-cover" />
            <span>Analyze Images</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 font-light text-sm p-5 border border-[#555] rounded-3xl">
            <img src="/code.png" alt="" className="w-10 h-10 object-cover" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="mt-auto w-1/2 bg-[#2c2937] rounded-3xl flex">
        <form onSubmit={handleSubmit} className="w-full flex items-center justify-between gap-5 p-4">
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            value={text}
            onChange={(e) => setText(e.target.value)} // Handle text change
            className="flex-1 p-5 bg-transparent border-none outline-none text-[#ececec]"
          />
          <button
            type="submit"
            className="bg-[#605e68] rounded-full p-3 flex items-center justify-center mr-5 cursor-pointer"
          >
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <img src="/arrow.png" alt="" className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
