import { db } from "../config/db.js";

// Almacenamiento de historial
export const createHistorial = async (HistorialData) => {
  console.log("Datos obtenidos para insertar:", HistorialData);
  const [result] = await db.query(
    `
        INSERT INTO Historial
        (idPaciente, fecha_inicio, fecha_fin, emocion_predom, prom_intensidad, total_dias, nivel_dominante, comentario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      HistorialData.idPaciente,
      HistorialData.fecha_inicio,
      HistorialData.fecha_fin,
      HistorialData.emocion_predom,
      HistorialData.prom_intensidad,
      HistorialData.total_dias,
      HistorialData.nivel_dominante,
      HistorialData.comentario,
    ]
  );
  console.log("Histoarial registrado");
  return result.insertId;
};

// Obtención de historial emocional
export const getHistoriaByPaciente = async (idPaciente) => {
  const [rows] = await db.query(
    `
        SELECT * FROM Historial WHERE idPaciente =  ?`,
    [idPaciente]
  );
  return rows;
};

// Obtención de sintomas para los pacientes
export const getSintomasByPaciente = async (idPaciente) => {
  const [rows] = await db.query(
    `
        SELECT * FROM Sintoma WHERE idPaciente =  ?`,
    [idPaciente]
  );
  return rows;
};

// Obtención de historial de los pacientes que cuentan con alguna cita con profesionales
export const getHistorial = async (idProfesional) => {
  const [rows] = await db.query(
    `
        SELECT h.*, CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, ' ')) AS nombrePaciente
        FROM Historial h
        INNER JOIN Cita c ON c.idPaciente = h.idPaciente
        INNER JOIN Paciente pac ON h.idPaciente = pac.idPaciente 
        INNER JOIN Usuario pa ON pac.idUsuario = pa.idUsuario
        WHERE c.idProfesional = ? GROUP BY h.idHistorial
    `,
    [idProfesional]
  );
  return rows;
};
