import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import NewPrompt from "./NewPrompt";
import useChatBotStore from "../../stores/useChatBotStore";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  // Get the necessary state and actions from your Zustand store
  const { chat, isLoading, isError, errorMessage, fetchChat } = useChatBotStore();

  useEffect(() => {
    // Fetch the chat data when the component mounts
    fetchChat(chatId);
  }, [chatId, fetchChat]);

  return (
    <div className="flex flex-col items-center h-screen pt-6">
      <div className="flex-1 w-full overflow-y-auto p-5 pb-36">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          {isLoading ? (
            <div className="text-center text-lg text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="text-center text-lg text-red-500">{errorMessage}</div>
          ) : (
            chat?.history?.map((message, i) => (
              <div key={i} className="flex justify-start gap-3">
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-[#2c2937] text-white self-end max-w-[80%] rounded-[20px] ml-auto"
                      : "bg-[#ffffff] text-black self-start max-w-[80%] rounded-[20px] mr-auto"
                  } p-4`}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Prompt Section */}
      {chat && <NewPrompt data={chat} />}
    </div>
  );
};

export default ChatPage;
