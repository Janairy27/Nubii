import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifySocketJWT = async (socket) => {

  const token = socket.handshake?.auth?.token;
  if (!token) throw new Error("Sin token");
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  socket.user = { id: payload.idUsuario, tipo: payload.tipo_usuario };
};
