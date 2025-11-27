import {
  crearNotificacion,
  obtenerNotificaciones,
  marcarComoLeido,
  marcarTodasComoLeidas,
  eliminarNotificacion,
} from "../models/notificacionModel.js";

// Crear una nueva notificación
export const registrarNotificacion = async (req, res) => {
  try {
    const { idUsuario, titulo, mensaje, tipo } = req.body;

    if (!idUsuario || !mensaje) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const idNotificacion = await crearNotificacion({
      idUsuario,
      titulo,
      mensaje,
      tipo,
    });
    res.status(201).json({ message: "Notificación creada", idNotificacion });
  } catch (error) {
    console.error("Error al registrar notificación:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener notificaciones por usuario
export const listarNotificaciones = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const notificaciones = await obtenerNotificaciones(idUsuario);
    res.json(notificaciones);
  } catch (error) {
    console.error("Error al listar notificaciones:", error);
    res.status(500).json({ error: error.message });
  }
};

//Marcar lieda solo una notificación
export const marcarLeido = async (req, res) => {
  const { idNotificacion } = req.params;
  try {
    await marcarComoLeido(idNotificacion);
    res.json({ message: "Notificación marcada como leída" });
  } catch (err) {
    console.error("Error marcando notificación:", err);
    res.status(500).json({ error: err.message });
  }
};

//Marcar como leidas todas las notificaciones
export const marcarTodasLeidas = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    await marcarTodasComoLeidas(idUsuario);
    res.json({ message: "Todas las notificaciones marcadas como leídas" });
  } catch (err) {
    console.error("Error marcando todas como leídas:", err);
    res.status(500).json({ error: err.message });
  }
};

// Eliminar notificación
export const borrarNotificacion = async (req, res) => {
  try {
    const { idNotificacion } = req.params;
    await eliminarNotificacion(idNotificacion);
    res.json({ message: "Notificación eliminada" });
  } catch (error) {
    console.error("Error al eliminar notificación:", error);
    res.status(500).json({ error: error.message });
  }
};
