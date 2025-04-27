import { Server, Socket } from "socket.io";
import http from "http";
import app from "./app";
import ChatService from "./app/services/implements/chatService";
import { IMessageData } from "./app/services/interface/IChatService";
import { SoketMsg } from "./constants/SoketMssg";
import { config } from "./config";
import NotificationService from "./app/services/implements/notificationService";
import { INotificationService } from "./app/services/interface/INotificationService";
import Messages from "./constants/Messages";

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
  pingTimeout: 60000,
  pingInterval: 25000,
  // Prevent multiple connections per client
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
  },
});

const chatService = new ChatService();
//instance of notificaiton service
const notificationService: INotificationService = new NotificationService();

// Track active rooms for each socket
const socketRooms = new Map<string, Set<string>>();

// Track user IDs to socket IDs for direct notifications
const userSockets = new Map<string, Set<string>>();

// Socket event handling
io.on("connection", (socket: Socket) => {
  console.log(SoketMsg.USER_CONNECTED, socket.id);

  // Initialize rooms set for this socket
  socketRooms.set(socket.id, new Set());

  //**********************************  NOTIFICATION  */
  //register user for notifications
  socket.on("register_user", (userId: string) => {
    if (!userId) return;

    // add this socket to the user's set of sockets
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }

    userSockets.get(userId)?.add(socket.id);

    console.log(`User ${userId} registered for notifications with socket ${socket.id}`);
  });

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

  //****************************************     SOCKET FN FOR MESSAGE       */
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

  //************************* NOTIFICATOIN EVENTS  */

  //fetch notifications for a user
  socket.on("fetch_notification", async (userId: string, limit: number = 10) => {
    try {
      const [notifications, unreadCount] = await Promise.all([
        notificationService.getNotifications(userId, limit),
        notificationService.getUnreadCount(userId),
      ]);

      socket.emit("notification_list", { notifications, unreadCount });
    } catch (error) {
      console.error(Messages.NOTIFICATION_FETCH_ERR, error);
      socket.emit("notification_error", { error: Messages.FAILED_NOTIFICATION_FETCH });
    }
  });

  //mark notificattion as read
  socket.on("mark_notification_read", async (notificationId: string) => {
    try {
      const updatedNotification = await notificationService.markAsRead(notificationId);
      if (updatedNotification) {
        socket.emit("notification_marked_read", updatedNotification);
      }
    } catch (error) {
      console.error(Messages.MARKING_NOTIFICATION_ERR, error);
    }
  });

  //mark all notification as read
  socket.on("mark_all_notifications_read", async (userId: string) => {
    try {
      await notificationService.markAllAsRead(userId);
      socket.emit("all_notifications_marked_read");
    } catch (error) {
      console.error(Messages.MARK_ALL_NOTIFICATION_ERR, error);
    }
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log(SoketMsg.USER_DISCONNECTED, socket.id);

    // Clean up rooms for this socket
    socketRooms.delete(socket.id);

    //Remove  this socket from user mapping
    userSockets.forEach((sockets, userId) => {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
      }
      if (sockets.size === 0) {
        userSockets.delete(userId);
      }
    });
  });
});

// function to send a notification to a specific user
export const sendUserNotification = async (userId: string, notificaitonData: any) => {
  try {
    //save notification to db
    const notification = await notificationService.createNotification({
      recipient: userId,
      ...notificaitonData,
    });

    // Send to all the sockets of that user
    const userSocketIds = userSockets.get(userId);
    if (userSocketIds && userSocketIds.size > 0) {
      userSocketIds.forEach((socketId) => {
        io.to(socketId).emit("new_notification", notification);
      });
    }

    return notification;
  } catch (error) {
    console.error(Messages.ERROR_SENDING_NOTIFICATION, error);
  }
};

// Add server monitoring
setInterval(() => {
  const connections = io.sockets.sockets.size;
  console.log(`Active connections: ${connections}`);
}, 180000);

export { server, io };
