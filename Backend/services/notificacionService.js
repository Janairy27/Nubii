import { db } from "../config/db.js"; 

export const crearNotificacion = async ({
  idUsuario,
  titulo,
  mensaje,
  tipo,
}) => {
  const query = `
    INSERT INTO Notificacion (idUsuario, titulo, mensaje, tipo)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [result] = await db.execute(query, [
      idUsuario,
      titulo,
      mensaje,
      tipo,
    ]);
    return result.insertId;
  } catch (err) {
    console.error("Error creando notificación:", err);
    throw err;
  }
};
export const obtenerNotificaciones = async (idUsuario) => {
  const query = `
    SELECT *
    FROM Notificacion
    WHERE idUsuario = ?
    ORDER BY fecha_creacion DESC
  `;
  try {
    const [result] = await db.execute(query, [idUsuario]);
    return result;
  } catch (err) {
    console.error("Error creando notificación:", err);
    throw err;
  }
};
