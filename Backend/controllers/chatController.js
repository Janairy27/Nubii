import { handleNewMessage, fetchChatHistory } from "../services/chatService.js";
import {
  obtenerPacientesPorProfesional,
  updateMensajesLeidos,
  obtenerMensajesNoLeidosModel,
  obtenerMensajesNoLeidosPacModel,
} from "../models/chatModel.js";

//Función para enviar un nuevo mensaje
export const enviarMensaje = async (req, res) => {
  try {
    const { idPaciente, idProfesional, mensaje, enviado } = req.body;
    const msg = await handleNewMessage({
      idPaciente: Number(idPaciente),
      idProfesional: Number(idProfesional),
      mensaje,
      enviado,
    });

    // Emitir mensaje por Socket.io
    import("../app.js").then(({ io }) => {
      io.to(`profesional_${idProfesional}`).emit("nuevo_mensaje", msg);
      io.to(`paciente_${idPaciente}`).emit("nuevo_mensaje", msg);
    });

    return res.status(201).json(msg);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al enviar mensaje" });
  }
};

//Función para obtener el historial de chat entre paciente y profesional
export const obtenerChat = async (req, res) => {
  try {
    const idPaciente = Number(req.params.idPaciente);
    const idProfesional = Number(req.params.idProfesional);
    if (isNaN(idPaciente) || isNaN(idProfesional)) {
      return res
        .status(400)
        .json({ message: "ID paciente o profesional inválido" });
    }
    const chat = await fetchChatHistory(idPaciente, idProfesional);
    res.json(chat);
  } catch (error) {
    console.error("Error al obtener chat:", error);
    res.status(500).json({ success: false, message: "Error al obtener chat" });
  }
};

//Función para obtener pacientes por profesional
export const getPacientesPorProfesional = async (req, res) => {
  const idProfesional = parseInt(req.params.idProfesional, 10);
  console.log("ID profesional recibido:", idProfesional);
  if (isNaN(idProfesional)) {
    return res.status(400).json({ message: "ID profesional inválido" });
  }
  try {
    const pacientes = await obtenerPacientesPorProfesional(idProfesional);
    console.log("Pacientes encontrados:", pacientes);
    res.json(pacientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo pacientes" });
  }
};

// Función para marcar mensajes como leídos
export const marcarMensajesLeidos = async (req, res) => {
  const { idPaciente, idProfesional } = req.params;
  const { rolLector } = req.body;

  try {
    await updateMensajesLeidos(idPaciente, idProfesional, rolLector); // función en tu modelo
    res.json({ success: true });
  } catch (err) {
    console.error("Error al marcar mensajes como leídos:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al marcar mensajes como leídos",
      });
  }
};

// Función para obtener mensajes no leídos por profesional

export const obtenerMensajesNoLeidos = async (req, res) => {
  let idProfesionalParam = req.params.idProfesional;

  if (!idProfesionalParam) {
    console.error("Error: Parámetro idProfesional faltante.");
    return res
      .status(400)
      .json({ message: "ID paciente o profesional inválido (Faltante)" });
  }
  const trimmedId = idProfesionalParam.trim();
  const idProfesional = parseInt(trimmedId, 10);

  console.log("Recibido ID (Original):", idProfesionalParam);
  console.log("Recibido ID (Trimmed):", trimmedId);
  console.log("Recibido ID (Parseado):", idProfesional);

  if (isNaN(idProfesional) || idProfesional <= 0) {
    console.log("ID después de Number(trim):", idProfesional);
    console.error(
      `Fallo de validación: El ID parseado (${idProfesional}) no es un número entero válido.`
    );
    return res
      .status(400)
      .json({ message: "ID paciente o profesional inválido" });
  }

  try {
    const data = await obtenerMensajesNoLeidosModel(idProfesional);
    //const dataArray = Object.keys(data).map(pacienteId => ({
    //  idPaciente: pacienteId,
    //count: data[pacienteId]
    //}));
    res.json(data);
  } catch (err) {
    console.error("Error al obtener mensajes no leídos:", err);
    res.status(500).json({ message: "Error al obtener mensajes no leídos" });
  }
};

// Función para obtener mensajes no leídos por paciente
export const obtenerMensajesNoLeidosPac = async (req, res) => {
  let idPacienteParam = req.params.idPaciente;

  if (!idPacienteParam) {
    console.error("Error: Parámetro idPaciente faltante.");
    return res
      .status(400)
      .json({ message: "ID paciente o profesional inválido (Faltante)" });
  }
  const trimmedId = idPacienteParam.trim();
  const idPaciente = parseInt(trimmedId, 10);

  console.log("Recibido ID (Original):", idPacienteParam);
  console.log("Recibido ID (Trimmed):", trimmedId);
  console.log("Recibido ID (Parseado):", idPaciente);

  if (isNaN(idPaciente) || idPaciente <= 0) {
    console.log("ID después de Number(trim):", idPaciente);
    console.error(
      `Fallo de validación: El ID parseado (${idPaciente}) no es un número entero válido.`
    );
    return res
      .status(400)
      .json({ message: "ID paciente o profesional inválido" });
  }

  try {
    const data = await obtenerMensajesNoLeidosPacModel(idPaciente);
    //const dataArray = Object.keys(data).map(pacienteId => ({
    //  idPaciente: pacienteId,
    //count: data[pacienteId]
    //}));
    res.json(data);
  } catch (err) {
    console.error("Error al obtener mensajes no leídos:", err);
    res.status(500).json({ message: "Error al obtener mensajes no leídos" });
  }
};
