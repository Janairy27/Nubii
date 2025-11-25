import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

//Import para notiificaciones
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import sintomaRoutes from "./routes/sintomaRoutes.js";
import actividadRoutes from "./routes/actividadRoutes.js";
import evidenciaRoutes from "./routes/evidenciaRoutes.js";
import recordatorioRoutes from "./routes/recordatorioRoutes.js";
import resultadoRoutes from "./routes/resultadoRoutes.js";
import citaRoutes from "./routes/citaRoutes.js";

import EstadoCitas from "./routes/estadosRoutes.js";
import Historial from "./routes/historialRoutes.js";
import Recomendacion from "./routes/recomendacionRoutes.js";

import notificacionRoutes from "./routes/notificacionRoutes.js";

import { procesarRecordatorios } from "./controllers/recordatorioController.js";

import RepEmocional from "./routes/repEmocionalRoutes.js";
import repCita from "./routes/repCitaRoutes.js";
import repDiagnostico from "./routes/repDiagnosticoRoutes.js";
import repSeguimiento from "./routes/repSeguimientoRoutes.js";
import repUso from "./routes/repUsoRoutes.js";
import repProfAgendados from "./routes/repProfAgendadosRoutes.js";


import Respaldo from "./routes/respaldoRoutes.js";

import chatRoutes from "./routes/chatRoutes.js";
//import { verifySocketJWT } from "./middleware/socketAuth.js";



dotenv.config();
const app = express();


// Definir __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));



app.use("/api/auth", authRoutes);
app.use("/api/sintomas", sintomaRoutes);
app.use("/api/actividades", actividadRoutes);
app.use("/api/evidencia", evidenciaRoutes);
app.use("/api/recordatorio", recordatorioRoutes);
app.use("/api/resultado", resultadoRoutes);
app.use("/api/citas", citaRoutes);

app.use("/api/estadoCita", EstadoCitas);
app.use("/api/historial", Historial);
app.use("/api/recomendacion", Recomendacion);

app.use("/api/repEmocional", RepEmocional);
app.use("/api/repCita", repCita);
app.use("/api/repDiagnostico", repDiagnostico);
app.use("/api/repSeguimiento", repSeguimiento);
app.use("/api/repUso", repUso);
app.use("/api/repProfAgendados", repProfAgendados);

app.use("/api/respaldo", Respaldo);



app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/notificaciones", notificacionRoutes);

app.use("/api/chat", chatRoutes);



// Crear servidor HTTP a partir de app (para usar con Socket.io)
const server = http.createServer(app);

// Configurar Socket.io
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Unirse a room de usuario
  const { role, id } = socket.handshake.query;
  if (role && id) {
    socket.join(`${role}_${id}`);
    console.log(`Usuario ${role}_${id} se unió a su room`);
  }

  socket.on("enviar_mensaje", (data) => {
    socket.broadcast.to(`profesional_${data.idProfesional}`).emit("nuevo_mensaje", data);
    io.to(`paciente_${data.idPaciente}`).emit("nuevo_mensaje", data);
  });

  socket.on("disconnect", () => console.log("Usuario desconectado"));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);

});

const INTERVALO = 5 * 60 * 1000; 

setInterval(async () => {
  console.log(`[🕒 ${new Date().toLocaleTimeString()}] Verificando recordatorios...`);
  try {
    await procesarRecordatorios();
  } catch (err) {
    console.error("Error procesando recordatorios:", err);
  }
}, INTERVALO);


