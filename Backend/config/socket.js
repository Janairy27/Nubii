import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Usuario desconectado:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io no inicializado");
  return io;
};
