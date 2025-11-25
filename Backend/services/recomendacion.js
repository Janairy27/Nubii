import { io } from "../app.js";
export const notificacionInterna = async (idUsuario, mensaje) => {
  console.log(` Enviando notificación a usuario ${idUsuario}: ${mensaje}`);

  // Envía la notificación a todos los sockets 
  io.emit("nuevaNotificacion", {
    idUsuario,
    mensaje,
    fecha: new Date()
  });
};
