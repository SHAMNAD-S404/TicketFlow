import React, { useEffect, useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { Chat, Message } from "../../../types/chat";
import { Socket, io } from "socket.io-client";
import { fetchAllMessages } from "@/api/services/communicationService";
import { toast } from "react-toastify";

const communicationServer = import.meta.env.VITE_COMMUNICATION_SERVER;

const socket: Socket = io(communicationServer,{
  withCredentials : true,
  transports : ["websocket"],
});

// Sample data
const sampleChats: Chat[] = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Kirti Yadav",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
      lastSeen: "3 hours ago",
    },
    lastMessage: "Are you there ??",
    timestamp: "11:10 AM",
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Ankit Mishra",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
      lastSeen: "1 hour ago",
    },
    lastMessage: "Are we meeting today? Let's...",
    timestamp: "3:45 PM",
  },
];

const sampleMessages: Message[] = [
  {
    id: "1",
    senderId: "other",
    content: "Let's together work on this an create something more awesome.",
    timestamp: "12:21 AM",
  },
  {
    id: "2",
    senderId: "me",
    content: "I really like your idea, but I still think we can do more in this.",
    timestamp: "12:22 AM",
  },
  {
    id: "3",
    senderId: "me",
    content: "I will share something",
    timestamp: "12:23 AM",
  },
];

interface IMessage {
  _id: string;
  ticketID: string;
  sender: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatProps {
  ticketID?: string;
  sender?: string;
}

const TicketChat: React.FC<ChatProps> = ({ ticketID, sender }) => {
  

  console.log("ticket Id : ",ticketID,"sender ; ",sender);
  


  const [selectedChatId, setSelectedChatId] = useState(sampleChats[0].id);
  const [messages, setMessages] = useState(sampleMessages);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [message1, setMessages1] = useState<string>("");
  const [messages2, setMessages2] = useState<IMessage[]>([]);

  useEffect(() => {
    //join the chat room for this ticket
    socket.emit("join_room", ticketID);

    const fetchMessages = async () => {
      try {
        const response = await fetchAllMessages(ticketID as string);
        setMessages2(response.data);
      } catch (error: any) {
        toast.error(error);
      }
    };

    fetchMessages();

    socket.on("receive_message", (newMessage: IMessage) => {
      setMessages2((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [ticketID]);

  //send message through socket io
  const sendMessages = (newMssg:string) => {
    if (messages) {
      socket.emit("send_message", { ticketID, sender, message:newMssg });
      setMessages1("");
    }
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      // Reset selected chat for mobile view to show the chat list
      if (window.innerWidth < 768) {
        setSelectedChatId("");
      } else {
        // Set first chat as selected for desktop view if none selected
        setSelectedChatId((prev) => prev || sampleChats[0].id);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedUser = sampleChats.find((chat) => chat.id === selectedChatId)?.user || null;

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: String(messages.length + 1),
      senderId: "me",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMessage]);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleBack = () => {
    setSelectedChatId("");
  };

  // For mobile: show either chat list or chat window
  if (isMobileView) {
    return (
      <div className="h-screen ">
        {!selectedChatId ? (
          <ChatSidebar chats={sampleChats} selectedChatId={selectedChatId || ""} onChatSelect={handleChatSelect} />
        ) : (
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={sendMessages}
            onBack={handleBack}
            isMobile={true}
          />
        )}
      </div>
    );
  }

  // For desktop: show both side by side
  return (
    <div className="h-screen flex overflow-hidden ">
      <div className="w-[320px]  ">
        <ChatSidebar chats={sampleChats} selectedChatId={selectedChatId || ""} onChatSelect={handleChatSelect} />
      </div>
      <div className="flex-1 overflow-hidden ">
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={sendMessages}
          isMobile={false}
        />
      </div>
    </div>
  );
};

export default TicketChat;
