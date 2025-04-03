import React, { useState } from "react";
import { Paperclip, Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { User, Message } from "../../types/chat";

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
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!selectedUser) {
    return (
      <div className=" flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="h-5/6 flex flex-col bg-white border rounded-xl ms-2 shadow-xl overflow-hidden ">
      <div className="border-b border-gray-200 p-4">
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
      </div>

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
      </div>

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
          <button className="p-2 hover:bg-gray-100 rounded-full"></button>
          <button onClick={handleSend} className="p-3 bg-purple-600 hover:bg-green-700 rounded-full">
            <Send className="h-6 w-6 text-white  " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
