import { db } from "../config/db.js";

// Creación de estados de citas
export const createEstado = async (idCita, estado) => {
  console.log("Datos obtenidos para insertar:", estado);
  const [result] = await db.query(
    `
        INSERT INTO Estado_cita
        (idCita, estado, fecha_cambio)
        VALUES (?, ?, now())`,
    [idCita, estado]
  );
  console.log("Estado de cita registrado");
  return result.insertId;
};

export const obtenerEstadoById = async (idCita) => {
  const [rows] = await db.query("SELECT * Estado_cita WHERE idCita = ?", [
    idCita,
  ]);
  return rows[0];
};

export const obtenerEstadoFinal = async (idCita) => {
  const [rows] = await db.query(
    "SELECT estado FROM Estado_cita WHERE idCita = ? ORDER BY fecha_cambio DESC LIMIT 1",
    [idCita]
  );
  return rows[0];
};
