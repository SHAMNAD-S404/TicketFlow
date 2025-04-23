import { Server, Socket } from "socket.io";
import http from "http";
import app from "./app";
import ChatService from "./app/services/implements/chatService";
import { IMessageData } from "./app/services/interface/IChatService";
import { SoketMsg } from "./constants/SoketMssg";
import { config } from "./config";

// Creating http server from express app
const server = http.createServer(app);

// Creating socket io instance with cors
const io = new Server(server, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
  // Set the path to match what's expected from the gateway
  path: "/socket.io",
  // Performance optimizations
  pingTimeout: 60000,
  pingInterval: 25000,
  // Prevent multiple connections per client
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
  },
});

const chatService = new ChatService();

// Track active rooms for each socket
const socketRooms = new Map<string, Set<string>>();

// Socket event handling
io.on("connection", (socket: Socket) => {
  console.log(SoketMsg.USER_CONNECTED, socket.id);

  // Initialize rooms set for this socket
  socketRooms.set(socket.id, new Set());

  // Join room based on the ticketID
  socket.on("join_room", (ticketID: string) => {
    // Get current rooms for this socket
    const currentRooms = socketRooms.get(socket.id) || new Set();

    // Leave all previous rooms first to prevent memory leaks
    currentRooms.forEach((room) => {
      if (room !== ticketID) {
        socket.leave(room);
      }
    });

    // Clear and add new room
    currentRooms.clear();
    currentRooms.add(ticketID);
    socketRooms.set(socket.id, currentRooms);

    // Join the new room
    socket.join(ticketID);
    console.log(`User ${socket.id} joined room ${ticketID}`);
  });

  // Handle sending a message
  socket.on("send_message", async (data: IMessageData) => {
    try {
      // Validate input data
      if (!data.ticketID || !data.sender || !data.message) {
        console.error("Invalid message data:", data);
        return;
      }

      const savedMessage = await chatService.saveMessage(data);

      // Emit to specific room only
      io.to(data.ticketID).emit("receive_message", savedMessage);
    } catch (error) {
      console.error(SoketMsg.ERROR_IN_SAVING_MSSG, error);
      // Consider emitting an error event to the client
      socket.emit("message_error", {
        error: "Failed to save message",
        ticketID: data.ticketID,
      });
    }
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log(SoketMsg.USER_DISCONNECTED, socket.id);
    // Clean up rooms for this socket
    socketRooms.delete(socket.id);
  });
});

// Add server monitoring
setInterval(() => {
  const connections = io.sockets.sockets.size;
  console.log(`Active connections: ${connections}`);
}, 60000);

export { server, io };
