import { useEffect, useRef, useState } from "react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useChatBotStore } from "../../stores/useChatBotStore"; // Import the store

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Ensure the first entry in the history has a role of 'user'
  const formattedHistory = data?.history?.length > 0
    ? data.history.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0].text }],
      }))
    : [{ role: 'user', parts: [{ text: "Hello, how can I assist you?" }] }];

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer]);

  // Use the Zustand store
  const { updateChat, fetchChatbotContext, chatbotContext } = useChatBotStore();

  useEffect(() => {
    fetchChatbotContext();
  }, [fetchChatbotContext]);

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      // Prepare the context data before sending the user prompt
      const contextMessage = `Here is the context data for you: ${chatbotContext}. Now, based on this context, please answer the following question:`;

      // Combine context and user prompt
      const combinedMessage = `${contextMessage} ${text} and give response in a professional way, means that don't sound like a robot`;
      
      const result = await chat.sendMessageStream([combinedMessage]);
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      // Update the chat with the new answer
      await updateChat(data.id, question, accumulatedText); // No image to upload
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {/* ADD NEW CHAT */}
      {/* {question && <div className="message user">{question}</div>} */}
      {/* {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )} */}
      <div className="endChat" ref={endRef}></div>
      <form
        className="newForm flex items-center gap-5 px-5 py-2 absolute bottom-0 bg-[#2c2937] rounded-2xl w-1/2"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <input
          type="text"
          name="text"
          placeholder="Ask anything..."
          className="flex-1 p-5 bg-transparent border-none outline-none text-[#ececec]"
        />
        <button className="w-12 h-12 bg-[#605e68] rounded-full flex items-center justify-center cursor-pointer">
          <img src="/arrow.png" alt="" className="w-4 h-4" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
