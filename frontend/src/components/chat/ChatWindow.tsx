import React, { useState, useRef, useEffect } from "react";
import { Send, Video,  ArrowLeft } from "lucide-react";
import { User, Message } from "../../types/chat";
import ChatBgImage from "../../assets/images/helpdesk2.png";
import { GiClick } from "react-icons/gi";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { TbHistoryOff } from "react-icons/tb";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isMobile: boolean;
  isRoomEmpty: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  onSendMessage,
  onBack,
  isMobile,
  isRoomEmpty,
}: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const navigate = useNavigate();
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!selectedUser) {
    return (
      <div className="relative flex items-center justify-center  bg-gray-50 h-5/6 ms-2 rounded-xl shadow-xl overflow-hidden">
        {/* Background Image */}
        <img
          src={ChatBgImage}
          className="absolute inset-0 w-full h-full object-cover opacity-80 rounded-xl"
          alt="Chat background"
        />

        {/* Text on top of image */}
        {isRoomEmpty ? (
          <div className="relative z-10 flex flex-col items-center gap-2 text-2xl  font-semibold text-white/70 text-center bg-black px-4 py-3 rounded-xl">
            <h1 className="flex items-center gap-1">
              {" "}
              No chat history exist! <TbHistoryOff className="text-red-600" />{" "}
            </h1>
            <h1 className="flex items-center gap-2">
              To start a new chat visit <FaArrowAltCircleRight />
              ticket details page{" "}
            </h1>
            <h1 className="flex items-center gap-1">
              and click
              <GiClick className="text-4xl text-blue-400" />
              on the chat <HiChatBubbleLeftRight className="text-green-500 text-3xl" /> icon
            </h1>
          </div>
        ) : (
          <h1 className="relative z-10 flex items-center gap-2 text-2xl font-semibold text-white text-center bg-black px-4 py-3 rounded-xl">
            Select a chat to start <GiClick className="text-4xl text-blue-400" />
          </h1>
        )}

        {/* Optional overlay for darkening the image slightly */}
        <div className="absolute inset-0 bg-black opacity-20 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="h-5/6 flex flex-col bg-white border rounded-xl ms-2 shadow-xl overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && onBack && (
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
            )}
            <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="font-semibold">{selectedUser.name}</h2>
              <p className="text-sm text-gray-500">
                {selectedUser.lastSeen ? `Last seen ${selectedUser.lastSeen}` : "Online"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            
            <button 
             onClick={() =>navigate("/company/dashboard/joincall")}
            className="p-2 hover:bg-gray-100 rounded-full">
              <Video className="h-5 w-5 text-gray-600" />
            </button>
           
          </div>
        </div>
      </header>

      {/* Messages */}

      <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === "me" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
              }`}>
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message here..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button onClick={handleSend} className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full">
            <Send className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
