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
    <div className="flex flex-col items-center h-full relative">
      <div className="flex-1 overflow-scroll w-full flex justify-center">
        <div className="w-1/2 flex flex-col gap-5">
          {isLoading ? (
            "Loading..."
          ) : isError ? (
            <span>{errorMessage}</span>
          ) : (
            chat?.history?.map((message, i) => (
              <div key={i}>
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-[#2c2937] self-end max-w-[80%] rounded-[20px]"
                      : ""
                  } p-5`}
                >
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
            ))
          )}

          {chat && <NewPrompt data={chat} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
