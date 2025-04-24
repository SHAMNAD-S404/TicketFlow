import { useState, useRef, useEffect } from "react";
import { FaHeadset, FaPaperPlane, FaTimes } from "react-icons/fa";
import { Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Aichatbot } from "@/api/services/ticketService";
import TypewriterText from "./TypeWriter";
import { getAIPrompt } from "@/utils/constants/aiPrompts";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string; fullText?: string }[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDefaultQuestions, setShowDefaultQuestions] = useState(true); // State to control showing default questions
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setTimeout(scrollToBottom, 100);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  const truncateText = (text: string, wordLimit = 30) => {
    const words = text.trim().split(/\s+/);
    if (words.length > wordLimit) {
      return { shortText: words.slice(0, wordLimit).join(" ") + "...", fullText: text };
    }
    return { shortText: text };
  };

  const sendMessage = async () => {
    if (countWords(inputText) > 100) {
      setError("Message cannot exceed 100 words.");
      return;
    }
    setError("");

    const { shortText, fullText } = truncateText(inputText);
    const updatedMessages = [...messages, { sender: "user", text: shortText, fullText }];
    setMessages(updatedMessages);
    setInputText("");

    setIsLoading(true);
    setMessages((prev) => [...prev, { sender: "chatbot", text: "Thinking" }]);

    try {
      // custom prompts
      const prompt = getAIPrompt(inputText);

      const response = await Aichatbot(prompt);

      if (response.success) {
        setMessages([...updatedMessages, { sender: "chatbot", text: response.data as string }]);
      } else {
        setMessages([...updatedMessages, { sender: "chatbot", text: "Error communicating with chatbot." }]);
      }
    } catch (error) {
      setMessages([...updatedMessages, { sender: "chatbot", text: "Network error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (showDefaultQuestions) setShowDefaultQuestions(false); // Hide questions once user starts typing
  };

  const defaultQuestions = [
    "What is TicketFlow?",
    "How is it beneficial for my organization?",
    "What are the main features?",
  ];

  return (
    <div>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
        {!isOpen && (
          <div className="relative right-6 max-w-xs bg-white text-gray-800 text-sm px-4 py-2 mb-1 rounded-lg shadow-md transition-opacity duration-300">
            <span className="font-semibold">How can I help you?</span>
            <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white transform rotate-45" />
          </div>
        )}

        <motion.button
          onClick={toggleChatbot}
          whileHover={{ scale: 1.1 }}
          animate={{ scale: isOpen ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 130, damping: 20 }}
          className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg relative ${
            isOpen
              ? "bg-gradient-to-br from-gray-100 to-white rotate-90"
              : "bg-gradient-to-br from-purple-600 to-purple-700"
          }`}
          aria-label={isOpen ? "Close chat" : "Open chat"}>
          <div className="relative">
            <Bot
              className={`transition-transform duration-500 ${isOpen ? "text-purple-600 rotate-90" : "text-white"}`}
              size={34}
            />
            {!isOpen && <Sparkles size={20} className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" />}
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0.7, scale: 0, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5, scale: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed bottom-[100px] right-6 z-50 w-96 h-[610px] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden origin-bottom-right">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaHeadset className="text-xl" />
                <span className="text-lg font-semibold">TicketFlow Assistant</span>
              </div>
              <button onClick={toggleChatbot}>
                <FaTimes className="hover:text-red-600" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {showDefaultQuestions && messages.length === 0 && (
                <div className="flex flex-col gap-2">
                  {defaultQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputText(q);
                        sendMessage();
                        setShowDefaultQuestions(false);
                      }}
                      className="px-4 py-2 text-left bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.length === 0 ? (
                <div className="mt-20 text-lg text-center text-gray-400">No messages yet.!</div>
              ) : (
                messages.map((msg, index) => {
                  // const isLastBotMessage =
                  //   index === messages.length - 1 && msg.sender === "chatbot" && msg.text !== "Thinking";
                  return (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`inline-block max-w-xs px-4 py-2 rounded-xl ${
                          msg.sender === "user" ? "bg-[#E8F8F5]" : "bg-[#F1F0F0]"
                        }`}>
                        {msg.text === "Thinking" && isLoading ? (
                          <span className="text-gray-500">
                            Thinking<span className="inline-block animate-pulse">...</span>
                          </span>
                        ) : (
                          <TypewriterText text={msg.text} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="p-4 flex items-center gap-2 bg-gray-100">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputText.trim()) sendMessage();
                }}
                className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                disabled={!inputText.trim()}>
                <FaPaperPlane size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
