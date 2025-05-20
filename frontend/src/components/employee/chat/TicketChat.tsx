import React, { useEffect, useState, useCallback, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { Chat, Message } from "../../../types/chat";
import { fetchAllMessages, fetchAllRooms } from "@/api/services/communicationService";
import getErrMssg from "@/components/utility/getErrMssg";
import { Rootstate } from "@/redux store/store";
import { IChatRoom, IMessage } from "@/interfaces/chat.interfaces";
import secrets from "@/config/secrets";

// Define interfaces

interface ChatProps {
  ticketID?: string;
  sender?: string;
  senderName?: string;
  user1?: string;
  user2?: string;
}

const TicketChat: React.FC<ChatProps> = ({ ticketID, sender, senderName, user1, user2 }) => {
  // Socket reference to maintain singleton instance
  const socketRef = useRef<Socket | null>(null);
  const communicationServer = import.meta.env.VITE_COMMUNICATION_SERVER;

  // Redux state
  const employee = useSelector((state: Rootstate) => state.employee.employee);

  // Derived values
  const currentSender = sender || employee?._id;
  const currentSenderName = senderName || employee?.name;
  const participantsId = employee?._id as string;

  // Component states
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
  const [selectedTicketID, setSelectedTicketID] = useState<string | undefined>(ticketID);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isRoomEmpty, setIsRoomEmpty] = useState<boolean>(false);

  // Initialize socket connection
  useEffect(() => {
    // Only create socket if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(secrets.APIGATEWAY_URL, {
        withCredentials: true,
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        path: "/socket.io",
      });

      // Global listeners
      socketRef.current.on("connect", () => {
        // console.log("Socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("connect_error", (_err) => {
        // console.error("Socket connection error:", err);
        toast.error("Connection error. Please refresh the page.");
      });
    }

    // Cleanup socket on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [communicationServer]);

  // Format chat rooms to match the chat interface for the sidebar
  const formatChatRooms = useCallback((rooms: IChatRoom[]): Chat[] => {
    return rooms.map((room) => ({
      id: room.ticketID,
      user: {
        id: room.participants[0] || "unknown",
        name: `Ticket #${room.ticketID}`,
        avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
        lastSeen: new Date(room.lastMessageTimestamp).toLocaleString(),
      },
      lastMessage: room.lastMessage,
      timestamp: new Date(room.lastMessageTimestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, []);

  // Format messages for the chat window
  const formatMessages = useCallback(
    (messageList: IMessage[]): Message[] => {
      return messageList.map((msg) => ({
        id: msg._id,
        senderId: msg.sender === currentSender ? "me" : "other",
        content: msg.message,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
    },
    [currentSender]
  );

  // Function to create new chat room if it doesn't exist
  const initializeChat = useCallback(
    async (chatTicketID: string, _chatSender: string) => {
      if (!socketRef.current) return;

      try {
        // Send an initial system message to create the room
        socketRef.current.emit("send_message", {
          ticketID: chatTicketID,
          sender: participantsId,
          message: `Chat started by ${currentSenderName} for ticket #${chatTicketID}`,
          user1,
          user2,
        });

        // Fetch messages again after a short delay
        setTimeout(async () => {
          try {
            const [messagesResponse, roomsResponse] = await Promise.all([
              fetchAllMessages(chatTicketID),
              fetchAllRooms(participantsId),
            ]);

            setChatRooms(roomsResponse.data);
            setMessages(messagesResponse.data);
                      
          } catch (_error) {
            toast.error("Error fetching messages after initialization");            
          }
        }, 1500);
      } catch (error) {
        toast.error(getErrMssg(error));
      }
    },
    [participantsId, currentSenderName, user1, user2]
  );

  // Fetch all chat rooms
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetchAllRooms(participantsId);
        setChatRooms(response.data);

        // If no ticketID was provided and we have chat rooms, select the first one
        if (!ticketID && response.data.length > 0 && !isMobileView) {
          setSelectedTicketID(response.data[0].ticketID);
        }

        if (ticketID) {
          setSelectedTicketID(ticketID);
        }

      } catch (error: any) {
        if (error.response?.status === 400) {
          setIsRoomEmpty(true);
        } else {
          toast.warn(getErrMssg(error));
        }
      }
    };

    fetchChatRooms();
  }, [ticketID, participantsId, isMobileView]);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const newIsMobileView = window.innerWidth < 768;
      setIsMobileView(newIsMobileView);

      if (newIsMobileView) {
        if (!ticketID) {
          setSelectedTicketID(undefined);
        }
      } else if (chatRooms.length > 0 && !selectedTicketID) {
        setSelectedTicketID(chatRooms[0].ticketID);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ticketID, chatRooms, selectedTicketID]);

  // Join room and fetch messages when selectedTicketID changes
  useEffect(() => {
    if (!selectedTicketID || !socketRef.current) return;

    // Clean up previous room listeners
    socketRef.current.off("receive_message");

    // Join the chat room
    socketRef.current.emit("join_room", selectedTicketID);

    // Set up message listener for this room
    socketRef.current.on("receive_message", (newMessage: IMessage) => {
      setMessages((prevMessages) => {
        // Check if message already exists to prevent duplicates
        if (prevMessages.some((msg) => msg._id === newMessage._id)) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    });

    // Fetch messages for the selected ticket
    const fetchMessages = async () => {
      try {
        const response = await fetchAllMessages(selectedTicketID);
        setMessages(response.data);
      } catch (error: any) {
        // If no messages exist, initialize the new chat
        if (!error.response?.data?.data && currentSender) {
          initializeChat(selectedTicketID, currentSender);
        }
      }
    };

    fetchMessages();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
      }
    };
  }, [selectedTicketID, currentSender, initializeChat]);

  // Function to send messages through Socket.IO
  const sendMessage = useCallback(
    (messageContent: string) => {
      if (!socketRef.current || !selectedTicketID || !currentSender || !messageContent.trim()) return;

      socketRef.current.emit("send_message", {
        ticketID: selectedTicketID,
        sender: currentSender,
        message: messageContent,
      });
    },
    [selectedTicketID, currentSender]
  );

  const handleChatSelect = useCallback((chatId: string) => {
    setSelectedTicketID(chatId);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedTicketID(undefined);
  }, []);

  // Prepare data for rendering
  const formattedChats = formatChatRooms(chatRooms);
  const formattedMessages = formatMessages(messages);
  const selectedChat = formattedChats.find((chat) => chat.id === selectedTicketID);
  const selectedUser = selectedChat?.user || null;

  // For mobile: show either chat list or chat window
  if (isMobileView) {
    return (
      <div className="h-screen">
        {!selectedTicketID ? (
          <ChatSidebar chats={formattedChats} selectedChatId={selectedTicketID || ""} onChatSelect={handleChatSelect} />
        ) : (
          <ChatWindow
            selectedUser={selectedUser}
            messages={formattedMessages}
            onSendMessage={sendMessage}
            onBack={handleBack}
            isRoomEmpty={isRoomEmpty}
            isMobile={true}
          />
        )}
      </div>
    );
  }

  // For desktop: show both side by side
  return (
    <div className="h-screen flex overflow-hidden mt-6">
      <div className="w-[320px]">
        <ChatSidebar chats={formattedChats} selectedChatId={selectedTicketID || ""} onChatSelect={handleChatSelect} />
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          selectedUser={selectedUser}
          messages={formattedMessages}
          onSendMessage={sendMessage}
          isMobile={false}
          isRoomEmpty={isRoomEmpty}
        />
      </div>
    </div>
  );
};

export default TicketChat;
