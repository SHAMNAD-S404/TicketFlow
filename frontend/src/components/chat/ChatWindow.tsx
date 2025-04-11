import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { User, Message } from "../../types/chat";
import ChatBgImage from "../../assets/images/chat bg image new.png"

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isMobile: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  onSendMessage,
  onBack,
  isMobile,
}: ChatWindowProps) => {

  console.log("chhat window test",messages);
  

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center bg-gray-50 h-5/6 ms-2 rounded-xl shadow-xl">
        {/* <p className="text-gray-500">Select a chat to start messaging</p> */}
        <img src={ChatBgImage} className="object-fill h-full opacity-70 rounded-2xl" alt="" />
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
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Video className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="h-5 w-5 text-gray-600" />
          </button>
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
