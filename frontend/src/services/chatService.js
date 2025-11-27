import axios from "axios";

const API_URL = "http://localhost:4000/api/chat";

export const enviarMensaje = async (mensajeData) => {
  try {
    const res = await axios.post(`${API_URL}/enviar`, mensajeData);
    return res.data;
  } catch (error) {
    console.error("Error en enviarMensaje:", error);
    throw error;
  }
};

export const obtenerChat = async (idPaciente, idProfesional) => {
  try {
    const res = await axios.get(`${API_URL}/${idPaciente}/${idProfesional}`);
    return res.data;
  } catch (error) {
    console.error("Error en obtenerChat:", error);
    throw error;
  }
};
