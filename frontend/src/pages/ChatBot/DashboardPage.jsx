import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useChatBotStore from "../../stores/useChatBotStore";
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
