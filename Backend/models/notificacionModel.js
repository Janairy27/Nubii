import { db } from "../config/db.js";

// Crear notificación
export const crearNotificacion = async ({
  idUsuario,
  titulo,
  mensaje,
  tipo,
}) => {
  const [result] = await db.query(
    `INSERT INTO Notificacion (idUsuario, titulo, mensaje, tipo) VALUES (?, ?, ?, ?)`,
    [idUsuario, titulo, mensaje, tipo]
  );
  return result.insertId;
};

// Obtener notificaciones por usuario
export const obtenerNotificaciones = async (idUsuario) => {
  const [rows] = await db.query(
    `SELECT * FROM Notificacion  WHERE idUsuario = ? ORDER BY fecha_creacion DESC`,
    [idUsuario]
  );
  return rows;
};

export const marcarComoLeido = async (idNotificacion) => {
  const [result] = await db.query(
    "UPDATE Notificacion SET leida = 1 WHERE idNotificacion = ?",
    [idNotificacion]
  );
  return result;
};

export const marcarTodasComoLeidas = async (idUsuario) => {
  const [result] = await db.query(
    "UPDATE Notificacion SET leida = 1 WHERE idUsuario = ?",
    [idUsuario]
  );
  return result;
};

// Eliminar notificación
export const eliminarNotificacion = async (idNotificacion) => {
  await db.query(`DELETE FROM Notificacion  WHERE idNotificacion = ?`, [
    idNotificacion,
  ]);
};
