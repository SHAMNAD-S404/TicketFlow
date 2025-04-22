import React, { useEffect, useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { Chat, Message } from "../../../types/chat";
import { Socket, io } from "socket.io-client";
import { fetchAllMessages, fetchAllRooms } from "@/api/services/communicationService";
import { toast } from "react-toastify";
import getErrMssg from "@/components/utility/getErrMssg";
import { useSelector } from "react-redux";
import { Rootstate } from "@/redux store/store";

const communicationServer = import.meta.env.VITE_COMMUNICATION_SERVER;

//initializing a connection with socket
const socket: Socket = io(communicationServer, {
  withCredentials: true,
  transports: ["websocket"],
});

interface IMessage {
  _id: string;
  ticketID: string;
  sender: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IChatRoom {
  _id: string;
  ticketID: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatProps {
  ticketID?: string;
  sender?: string;
  senderName?: string;
  user1?: string;
  user2?: string;
}

const CompanyChat: React.FC<ChatProps> = ({ ticketID, sender, senderName, user1, user2 }) => {
  const company = useSelector((state: Rootstate) => state.company.company);

  sender = sender ? sender : company?._id;
  senderName = senderName ? senderName : company?.companyName;
  const participantsId: string = company?._id as string;

  //******component states************
  //for responsive design
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
  const [selectedTicketID, setSelectedTicketID] = useState<string | undefined>(ticketID);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  //format chat rooms to match the chat interface for the sidebar
  const formatChatRooms = (rooms: IChatRoom[]): Chat[] => {
    return rooms.map((rooms) => ({
      id: rooms.ticketID,
      user: {
        id: rooms.participants[0] || "unknown",
        name: `Ticket #${rooms.ticketID}`,
        avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
        lastSeen: new Date(rooms.lastMessageTimestamp).toLocaleString(),
      },
      lastMessage: rooms.lastMessage,
      timestamp: new Date(rooms.lastMessageTimestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  };

  //format messages for the chat window
  const formatMessages = (messageList: IMessage[]): Message[] => {
    return messageList.map((msg) => ({
      id: msg._id,
      senderId: msg.sender === sender ? "me" : "other",
      content: msg.message,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  };

  //fn to create new chat room if didn't exist
  const initializeChat = async (ticketID: string, sender: string) => {
    try {
      const hasMessages = messages.length > 0;
      if (!hasMessages && ticketID && sender) {
        // Send an initial system message to create the room
        socket.emit("send_message", {
          ticketID: ticketID,
          sender: participantsId,
          message: `Chat started by ${senderName} for ticket #${ticketID}`,
          user1: user1,
          user2: user2,
        });

        // Fetch messages again after a short delay to make sure our message was saved
        setTimeout(async () => {
          try {
            const roomsData = await fetchAllRooms(participantsId);
            const response = await fetchAllMessages(ticketID);
            setChatRooms(roomsData.data);
            setMessages(response.data);
          } catch (error) {
            toast.error("Error fetching messages after initialization");
          }
        }, 1500);
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    }
  };

  //fetch all chat rooms
  useEffect(() => {
    //fn to fetch chat rooms
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        const response = await fetchAllRooms(participantsId);
        setChatRooms(response.data);

        // If no ticketID was provided and we have chat rooms, select the first one
        if (!ticketID && response.data.length > 0 && !isMobileView) {
          setSelectedTicketID(response.data[0].ticketID);
        }

        if (ticketID) {
          setSelectedTicketID(ticketID);
        }

        setLoading(false);
      } catch (error: any) {
        toast.error(getErrMssg(error));
      }
    };

    fetchChatRooms();

    //fn to select tikcet id and responsive ui logic
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        if (!ticketID) {
          setSelectedTicketID(undefined);
        }
      } else if (chatRooms.length > 0 && !selectedTicketID) {
        setSelectedTicketID(chatRooms[0].ticketID);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ticketID]);

  //join room and fetch message when selectedTicketID changes
  useEffect(() => {
    console.log("sleec id ", selectedTicketID);
    if (!selectedTicketID) return;

    //join the chat room
    socket.emit("join_room", selectedTicketID);

    // fetch messages for the selected ticket
    const fetchMessages = async () => {
      try {
        const response = await fetchAllMessages(selectedTicketID);
        setMessages(response.data);
      } catch (error: any) {
        //if no messages exist , initialize the new chat
        if (!error.response?.data?.data && sender) {
          initializeChat(selectedTicketID, sender);
          // return;
        }

        //toast.error(getErrMssg(error));
      }
    };

    fetchMessages();

    //listen for the new messages
    socket.on("receive_message", (newMessages: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessages]);
    });

    //cleanup fn
    return () => {
      socket.off("receive_message");
    };
  }, [selectedTicketID, sender]);

  //fn to send messages through socket io
  const sendMessage = (messageContent: string) => {
    if (selectedTicketID && sender && messageContent.trim()) {
      socket.emit("send_message", {
        ticketID: selectedTicketID,
        sender,
        message: messageContent,
      });
      setNewMessage("");
    }
  };

  const handleChatSelect = (chatId: string) => setSelectedTicketID(chatId);

  const handleBack = () => setSelectedTicketID(undefined);

  const formattedChats = formatChatRooms(chatRooms);
  const formattedMessages = formatMessages(messages);

  //find the selected user info
  const selectedChat = formattedChats.find((chat) => chat.id === selectedTicketID);
  const selectedUser = selectedChat?.user || null;

  // For mobile: show either chat list or chat window
  if (isMobileView) {
    return (
      <div className="h-screen ">
        {!selectedTicketID ? (
          <ChatSidebar chats={formattedChats} selectedChatId={selectedTicketID || ""} onChatSelect={handleChatSelect} />
        ) : (
          <ChatWindow
            selectedUser={selectedUser}
            messages={formattedMessages}
            onSendMessage={sendMessage}
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
        <ChatSidebar chats={formattedChats} selectedChatId={selectedTicketID || ""} onChatSelect={handleChatSelect} />
      </div>
      <div className="flex-1 overflow-hidden ">
        <ChatWindow
          selectedUser={selectedUser}
          messages={formattedMessages}
          onSendMessage={sendMessage}
          isMobile={false}
        />
      </div>
    </div>
  );
};

export default CompanyChat;
