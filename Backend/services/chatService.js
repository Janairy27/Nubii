import {
  createChatMessage,
  getChatMessages,
  getPacienteByChat,
  obtenerMensajeCorreo,
} from "../models/chatModel.js";
import { sendEmailNotification } from "./emailService.js";
import { crearNotificacion } from "./notificacionService.js";
import { getUsuarioByProfesional } from "../models/profesionalModelo.js";
import { getUsuarioByPaciente } from "../models/pacienteModel.js";
import { notificacionInterna } from "../services/recomendacion.js";

export const handleNewMessage = async ({
  idPaciente,
  idProfesional,
  mensaje,
  enviado,
}) => {
  const idChat = await createChatMessage({
    idPaciente,
    idProfesional,
    mensaje,
    enviado,
  });
  const fullMessage = {
    idMensaje: idChat,
    idPaciente,
    idProfesional,
    mensaje,
    enviado,
  };

  let idReceptorRol = null;
  let titulo = "";
  let mensajeNotif = "";

  //  Determinar el RECEPTOR y construir la notificación
  if (enviado === "paciente") {
    idReceptorRol = idProfesional;
    titulo = "Nuevo mensaje de un paciente";
    const nombreRemitente = await getUsuarioByPaciente(idPaciente);
    mensajeNotif = `El paciente ${nombreRemitente} te ha enviado un nuevo mensaje.`;
  } else if (enviado === "profesional") {
    idReceptorRol = idPaciente;
    titulo = "Nuevo mensaje de tu profesional";
    const nombreRemitente = await getUsuarioByProfesional(idProfesional);
    mensajeNotif = `Tu profesional (${nombreRemitente}) te ha respondido un mensaje.`;
  }

  // Si no tenemos un ID de rol válido para el receptor, salimos.
  if (!idReceptorRol) {
    console.error(
      "Error: ID de rol del receptor no pudo ser determinado o es nulo."
    );
    return fullMessage;
  }
  //  Obtener la información del receptor 
  let receptorInfo = null;

  if (enviado === "profesional") {
    // Receptor es el PACIENTE
    receptorInfo = await obtenerMensajeCorreo(idReceptorRol, null);
  } else {
    // Receptor es el PROFESIONAL
    receptorInfo = await obtenerMensajeCorreo(null, idReceptorRol);
  }

  // Verificar si el usuario fue encontrado 
  if (!receptorInfo) {
    console.log("No se encontró la información del usuario receptor en la BD.");
    return fullMessage;
  }

  const idUsuarioReceptor = receptorInfo.idUsuario;

  if (idUsuarioReceptor) {
    //  Crear notificación 
    await crearNotificacion({
      idUsuario: idUsuarioReceptor,
      titulo,
      mensaje: mensajeNotif,
      tipo: "alerta",
    });
    await notificacionInterna(idUsuarioReceptor, mensajeNotif);

    if (!receptorInfo.estaActivo && receptorInfo.email) {
      console.log(
        `✉️ Enviando correo a ${receptorInfo.email}. Usuario inactivo.`
      );
      await sendEmailNotification({
        to: receptorInfo.email,
        subject: titulo,
        text: mensajeNotif,
      });
    }
  } else {
    console.log(" No se encontró idUsuario dentro de la info del receptor.");
  }

  return fullMessage;
};

export const fetchChatHistory = async (idPaciente, idProfesional) => {
  return await getChatMessages(idPaciente, idProfesional);
};
