import { useEffect, useRef, useState } from "react";
import model from "../../lib/gemini";
import { useChatBotStore } from "../../stores/useChatBotStore";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSending, setIsSending] = useState(false); // track sending status

  // Zustand store
  const { updateChat, fetchChatbotContext, chatbotContext } = useChatBotStore();

  // Scroll to bottom ref
  const endRef = useRef(null);
  const formRef = useRef(null);

  // Scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer]);

  // Fetch context on mount
  useEffect(() => {
    fetchChatbotContext();
  }, [fetchChatbotContext]);

  // Format initial chat history
  const formattedHistory =
    data?.history?.length > 0
      ? data.history.map(({ role, parts }) => ({
          role,
          parts: [{ text: parts[0].text }],
        }))
      : [{ role: "user", parts: [{ text: "Hello, how can I assist you?" }] }];

  // Initialize chat
  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  // Flag to run initial message only once
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current && data?.history?.length === 1) {
      add(data.history[0].parts[0].text, true);
    }
    hasRun.current = true;
  }, []);

  // Main send function
  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    // Don't send if no text
    if (!text || text.trim() === "") return;

    // Check context validity
    const hasContext =
      chatbotContext && typeof chatbotContext === "string" && chatbotContext.trim() !== "";

    // Optionally, prevent sending if context is required
    // if (!hasContext) {
    //   console.warn("Context not ready yet!");
    //   return;
    // }

    setIsSending(true);

    try {
      // Build message
      let combinedMessage = text;
      if (hasContext) {
        combinedMessage = `
Here is the context data for you:
${chatbotContext}

Now, based on this context, please answer the following question:

${text}

Respond in a professional way and do not sound robotic.
`;
      }

      // Stream response
      const result = await chat.sendMessageStream([combinedMessage]);

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      // Update chat store
      await updateChat(data.id, text, accumulatedText);
    } catch (err) {
      console.error("Gemini Error:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text || text.trim() === "") return;
    add(text, false);
    e.target.reset();
  };

  return (
    <>
      {/* Messages */}
      <div className="messages flex flex-col gap-3 overflow-y-auto p-5">
        {question && (
          <div className="message user bg-[#3a3a3a] text-white p-3 rounded-lg self-end max-w-[70%]">
            {question}
          </div>
        )}
        {answer && (
          <div className="message ai bg-[#505050] text-white p-3 rounded-lg self-start max-w-[70%]">
            {answer}
          </div>
        )}
        <div className="endChat" ref={endRef}></div>
      </div>

      {/* Input form */}
      <form
        className="newForm flex items-center gap-5 px-5 py-2 absolute bottom-0 bg-[#2c2937] rounded-2xl w-1/2"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <input
          type="text"
          name="text"
          placeholder={chatbotContext ? "Ask anything..." : "Loading context..."}
          className="flex-1 p-5 bg-transparent border-none outline-none text-[#ececec]"
          disabled={isSending || !chatbotContext} // disable if sending or context not ready
        />
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
            isSending || !chatbotContext ? "bg-gray-600 cursor-not-allowed" : "bg-[#605e68]"
          }`}
          disabled={isSending || !chatbotContext}
        >
          <img src="/arrow.png" alt="Send" className="w-4 h-4" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
