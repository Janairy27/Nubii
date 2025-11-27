import { db } from "../config/db.js";

// Función para mostrarle la información necesaria al administrador
export const reporteProfesionalesAdm = async (filtros = {}) => {
  // Sentencia SQL para obtener información que se mostrará en la vista
  let query = `
        SELECT * FROM (
            SELECT 
            CONCAT(prof.Nombre, ' ', prof.aPaterno, ' ', IFNULL(prof.aMaterno, '')) AS nombreProfesional,
            pr.especialidad, 
            COUNT(DISTINCT c.idCita) AS total_citas,
            SUM(CASE WHEN ec.estado = 4 THEN 1 ELSE 0 END) AS citas_concluidas,
            SUM(CASE WHEN ec.estado IN (5, 6, 7, 8, 10, 11) THEN 1 ELSE 0 END) AS citas_fallidas,
            SUM(CASE WHEN ec.estado = 2 THEN 1 ELSE 0 END) AS citas_aceptadas,
            DATE_FORMAT(MIN(c.fecha_cita), '%Y-%m-%d') AS primera_cita,
            DATE_FORMAT(MAX(c.fecha_cita), '%Y-%m-%d') AS ultima_cita
            FROM Cita c
            INNER JOIN Profesional pr ON pr.idProfesional = c.idProfesional
            INNER JOIN Usuario prof ON prof.idUsuario = pr.idUsuario
            INNER JOIN Estado_cita ec ON c.idCita = ec.idCita
            WHERE 1 = 1   
    `;

  // Establecer parametros y validaciones sonbre la información seleccionada en los filtros
  const parametros = [];
  if (filtros.nombreProfesional) {
    query +=
      " AND CONCAT(prof.Nombre, ' ', prof.aPaterno, ' ', prof.aMaterno) LIKE ? ";
    parametros.push(`%${filtros.nombreProfesional}%`);
  }

  if (filtros.especialidad) {
    query += " AND pr.especialidad = ? ";
    parametros.push(filtros.especialidad);
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

  // Agrupación de la información en la selección interna de la consulta
  query += `GROUP BY nombreProfesional, pr.especialidad 
    ) AS resumen WHERE 1 = 1 `;

  if (filtros.citasMin) {
    query += " AND resumen.total_citas >= ? ";
    parametros.push(filtros.citasMin);
  }

  if (filtros.citasMax) {
    query += " AND resumen.total_citas <= ? ";
    parametros.push(filtros.citasMax);
  }

  // Agrupamiento de la información dependiendo la cantidad de citas
  query += "ORDER BY resumen.total_citas DESC";

  try {
    const [rows] = await db.query(query, parametros);
    return rows.length ? rows : [];
  } catch (err) {
    console.log(
      "Error al obtener reporte de profesionales más agendados:",
      err
    );
    throw err;
  }
};

// Consulta para obtener la información necesario y mostrarla a el profesional
export const reporteAgendadosProf = async (filtros = {}, idProfesional) => {
  let query = `
        SELECT
        CONCAT(pa.nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, '')) AS nombrePaciente,
        COUNT(DISTINCT c.idCita) AS total_citas,
        SUM(CASE WHEN ec.estado = 4 THEN 1 ELSE 0 END) AS citas_concluidas,
        SUM(CASE WHEN ec.estado IN (5, 6, 7, 8, 10, 11) THEN 1 ELSE 0 END) AS citas_fallidas,
        SUM(CASE WHEN ec.estado = 2 THEN 1 ELSE 0 END) AS citas_aceptadas,
        SUM(CASE WHEN ec.estado = 1 THEN 1 ELSE 0 END) AS citas_pendientes,
        DATE_FORMAT(MIN(c.fecha_cita), '%Y-%m-%d') AS primera_cita,
        DATE_FORMAT(MAX(c.fecha_cita), '%Y-%m-%d') AS ultima_cita
        FROM Cita c
        INNER JOIN Paciente p ON p.idPaciente = c.idPaciente
        INNER JOIN Usuario pa ON pa.idUsuario = p.idUsuario
        INNER JOIN Estado_cita ec ON c.idCita = ec.idCita
        WHERE c.idProfesional = ? 
    `;

  const parametros = [idProfesional];
  if (filtros.nombrePaciente) {
    query +=
      " AND CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', pa.aMaterno) LIKE ? ";
    parametros.push(`%${filtros.nombrePaciente}%`);
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

  query += "GROUP BY nombrePaciente ORDER BY total_citas DESC";

  try {
    const [rows] = await db.query(query, parametros);
    return rows.length ? rows : [];
  } catch (err) {
    console.log("Error al obtener reporte de citas agendadas:", err);
    throw err;
  }
};
