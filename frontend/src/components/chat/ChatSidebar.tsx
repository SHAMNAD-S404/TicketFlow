import React from "react";
import { Search, MessageSquareMore } from "lucide-react";
import { Chat } from "@/types/chat";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string;
  onChatSelect: (chatId: string) => void;
}

const  ChatSidebar :React.FC<ChatSidebarProps> = ({ chats, selectedChatId, onChatSelect }: ChatSidebarProps) => {
  return (
    <div className="h-5/6 flex flex-col bg-white shadow-xl rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chats</h1>
        <button className="bg-purple-600 p-2 rounded-full text-white shadow-md hover:bg-purple-700 transition">
          <MessageSquareMore className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Chat Filters */}
      {/* <div className="flex gap-4 mt-4 px-4">
        <button className="text-sm font-semibold text-purple-600 border-b-2 border-purple-600 pb-1">DIRECT</button>
        <button className="text-sm font-semibold text-gray-500">GROUPS</button>
        <button className="text-sm font-semibold text-gray-500">PUBLIC</button>
      </div> */}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto mt-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`p-4 cursor-pointer flex items-center gap-3 rounded-lg mx-2 transition ${
              selectedChatId === chat.id ? "bg-purple-600 text-white" : "hover:bg-gray-100"
            }`}>
            {/* User Avatar */}
            <img
              src={chat.user.avatar}
              alt={chat.user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
            />

            {/* Chat Info */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className={`font-semibold ${selectedChatId === chat.id ? "text-white" : "text-gray-900"}`}>
                  {chat.user.name}
                </h3>
                <span className={`text-xs ${selectedChatId === chat.id ? "text-gray-200" : "text-gray-500"}`}>
                  {chat.timestamp}
                </span>
              </div>
              <p className={`text-sm truncate ${selectedChatId === chat.id ? "text-gray-300" : "text-gray-500"}`}>
                {chat.lastMessage}
              </p>
            </div>

            {/* Unread Messages Badge */}
            {chat.unreadCount > 0 && (
              <div className="bg-purple-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {chat.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar
