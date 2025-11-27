import { db } from "../config/db.js";

export const reporteEmocional = async (filtros = {}, idPaciente) => {
  let query = `
        SELECT {{agruparPor}} AS tiempo,
        s.emocion, AVG(s.intensidad) AS promedio_intensidad,
        COUNT(*) AS cantidad_registros
        FROM Sintoma s
        INNER JOIN Paciente p ON p.idPaciente = s.idPaciente
        INNER JOIN Usuario pa ON pa.idUsuario = p.idUsuario
        WHERE p.idPaciente = ?         
    `;

  const parametros = [idPaciente];
  if (filtros.fechaInicio && filtros.fechaFin) {
    query += "AND s.fecha BETWEEN ? AND ? ";
    parametros.push(filtros.fechaInicio, filtros.fechaFin);
  }

  let agruparPor = "";
  if (filtros.tipoReporte === "semanal") {
    agruparPor =
      "DATE_SUB(DATE(s.fecha), INTERVAL (DAYOFWEEK(s.fecha) - 2) DAY) ";
  } else if (filtros.tipoReporte === "mensual") {
    agruparPor = "DATE_FORMAT(s.fecha, '%Y-%m') ";
  } else {
    agruparPor = "DATE(s.fecha)";
  }

  query = query.replace("{{agruparPor}}", agruparPor);

  query += "GROUP BY tiempo, s.emocion ORDER BY tiempo";

  try {
    const [rows] = await db.query(query, parametros);
    return rows;
  } catch (err) {
    console.log("Error al obtener reporte de síntomas:", err);
    throw err;
  }
};

export const reporteEmocionalProf = async (filtros = {}, idProfesional) => {
  let query = `
        SELECT CONCAT(pa.nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, '')) AS nombrePaciente,
        AVG(s.intensidad) AS promedio_intensidad, s.emocion,
        MAX(p.nivel_estres) AS nivel_estres,
        COUNT(DISTINCT s.idSintoma) AS total_registros, {{agruparPor}} AS periodo
        FROM Sintoma s
        INNER JOIN Paciente p ON p.idPaciente = s.idPaciente
        INNER JOIN Usuario pa ON pa.idUsuario = p.idUsuario
        INNER JOIN Cita c ON p.idPaciente = c.idPaciente 
        WHERE c.idProfesional = ?
    `;

  const parametros = [idProfesional];
  if (filtros.idPaciente) {
    query += "AND p.idPaciente = ? ";
    parametros.push(filtros.idPaciente);
  }

  if (filtros.nombrePaciente) {
    query +=
      "AND CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', pa.aMaterno) LIKE ? ";
    parametros.push(`%${filtros.nombrePaciente}%`);
  }

  if (filtros.fechaInicio && filtros.fechaFin) {
    query += "AND s.fecha BETWEEN ? AND ? ";
    parametros.push(filtros.fechaInicio, filtros.fechaFin);
  }

  let agruparPor = "";
  if (filtros.tipoReporte === "semanal") {
    agruparPor =
      "DATE_SUB(DATE(s.fecha), INTERVAL (DAYOFWEEK(s.fecha) - 2) DAY) ";
  } else if (filtros.tipoReporte === "mensual") {
    agruparPor = "DATE_FORMAT(s.fecha, '%Y-%m') ";
  } else {
    agruparPor = "DATE(s.fecha)";
  }

  query = query.replace("{{agruparPor}}", agruparPor);

  query +=
    "GROUP BY nombrePaciente, s.emocion, periodo ORDER BY promedio_intensidad DESC";

  try {
    const [rows] = await db.query(query, parametros);
    return rows.length ? rows : [];
  } catch (err) {
    console.log("Error al obtener reporte de síntomas:", err);
    throw err;
  }
};
