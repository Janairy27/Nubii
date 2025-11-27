import { db } from "../config/db.js";

// Consulta para obtener la información necesario y mostrarla a el profesional
export const reporteCitaProf = async (filtros = {}, idProfesional) => {
  let query = `
        SELECT
        CONCAT(pa.nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, '')) AS nombrePaciente,
        c.fecha_cita, c.duracion_horas, c.modalidad, ec.estado, c.comentario
        FROM Cita c
        INNER JOIN Paciente p ON p.idPaciente = c.idPaciente
        INNER JOIN Usuario pa ON pa.idUsuario = p.idUsuario
        INNER JOIN (
            SELECT e1.idCita, e1.estado
            FROM estado_cita e1
            INNER JOIN (
                SELECT idCita, MAX(fecha_cambio) AS ultima_fecha
                FROM estado_cita
                GROUP BY idCita
            ) e2 ON e1.idCita = e2.idCita AND e1.fecha_cambio = e2.ultima_fecha
        ) ec ON c.idCita = ec.idCita 
        WHERE c.idProfesional = ? 
    `;

  const parametros = [idProfesional];
  if (filtros.idPaciente) {
    query += "AND p.idPaciente = ? ";
    parametros.push(filtros.idPaciente);
  }

  if (filtros.fechaInicio && filtros.fechaFin) {
    query += "AND c.fecha_cita BETWEEN ? AND ? ";
    parametros.push(filtros.fechaInicio, filtros.fechaFin);
  }

  let agruparPor = "";
  if (filtros.tipoReporte === "semanal") {
    agruparPor =
      "DATE_SUB(DATE(c.fecha_cita), INTERVAL (DAYOFWEEK(c.fecha_cita) - 2) DAY) ";
  } else if (filtros.tipoReporte === "mensual") {
    agruparPor = "DATE_FORMAT(c.fecha_cita, '%Y-%m') ";
  } else {
    agruparPor = "DATE(c.fecha_cita)";
  }

  query += "ORDER BY c.fecha_cita DESC";

  try {
    const [rows] = await db.query(query, parametros);
    return rows.length ? rows : [];
  } catch (err) {
    console.log("Error al obtener reporte de citas:", err);
    throw err;
  }
};

export const reporteCitasAdm = async (filtros = {}) => {
  let query = `
        SELECT 
        CONCAT(prof.Nombre, ' ', prof.aPaterno, ' ', IFNULL(prof.aMaterno, '')) AS nombreProfesional,
        prof.email, pr.especialidad, 
        COUNT(CASE WHEN ec.estado = 1 THEN 1 END) AS citas_pendientes,
        COUNT(CASE WHEN ec.estado IN (2, 3, 4, 7, 8, 12) THEN 1 END) AS citas_confirmadas,
        COUNT(CASE WHEN ec.estado IN (5, 6) THEN 1 END) AS citas_canceladas
        FROM Cita c
        INNER JOIN Profesional pr ON pr.idProfesional = c.idProfesional
        INNER JOIN Usuario prof ON prof.idUsuario = pr.idUsuario
        INNER JOIN (
            SELECT e1.idCita, e1.estado
            FROM estado_cita e1
            INNER JOIN (
                SELECT idCita, MAX(fecha_cambio) AS ultima_fecha
                FROM estado_cita
                GROUP BY idCita
            ) e2 ON e1.idCita = e2.idCita AND e1.fecha_cambio = e2.ultima_fecha
        ) ec ON c.idCita = ec.idCita
    `;

  query += "GROUP BY nombreProfesional, prof.email ORDER BY nombreProfesional";

  try {
    const [rows] = await db.query(query);
    return rows;
  } catch (err) {
    console.log("Error al obtener reporte de citas:", err);
    throw err;
  }
};
