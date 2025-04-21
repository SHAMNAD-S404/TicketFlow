import { Server } from "socket.io";
import http from "http";
import app from "./app";
import ChatService from "./app/services/implements/chatService";
import { IMessageData } from "./app/services/interface/IChatService";
import { SoketMsg } from "./constants/SoketMssg";
import { config } from "./config";

//creating http server from express app
const server = http.createServer(app);

//creating socket io instance with cors
const io = new Server(server, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

const chatService = new ChatService();

//socket event handling
io.on("connection", (socket) => {
  console.log(SoketMsg.USER_CONNECTED), socket.id;

  //join room based on the ticketID
  socket.on("join_room", (ticketID: string) => {
    socket.join(ticketID);
    console.log(`User ${socket.id} joined room ${ticketID}`);
  });

  //handle sending a message
  socket.on("send_message", async (data: IMessageData) => {
    try {
      console.log("im here ", data);
      const savedMessage = await chatService.saveMessage(data);
      io.to(data.ticketID).emit("receive_message", savedMessage);
    } catch (error) {
      console.error(SoketMsg.ERROR_IN_SAVING_MSSG);
    }
  });

  socket.on("disconnect", () => {
    console.log(SoketMsg.USER_DISCONNECTED, socket.id);
  });
});

export { server, io };
