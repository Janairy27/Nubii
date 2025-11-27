import { db } from "../config/db.js";

// Consulta en donde se muestra información únicamente del paciente
export const reporteDiagnosticoPac = async (filtros = {}, idPaciente) => {
  let query = `
        SELECT r.tipo_test,
        COUNT(*) AS total_aplicaciones, ROUND(AVG(r.puntaje), 2) AS promedio_puntaje,
        MAX(r.fecha_aplicacion) AS ultima_fecha,
        GROUP_CONCAT(DISTINCT r.categ_resultado ORDER BY r.categ_resultado SEPARATOR ', ') AS categorias_resultado,
        GROUP_CONCAT(DISTINCT r.interpretacion SEPARATOR ';') AS interpretaciones,
        GROUP_CONCAT(DISTINCT r.recomendacion SEPARATOR ';') AS recomendaciones        
        FROM ResultadoTest r
        INNER JOIN Paciente p ON p.idPaciente = r.idPaciente
        INNER JOIN Usuario pa ON pa.idUsuario = p.idUsuario
        WHERE p.idPaciente = ?         
    `;

  const parametros = [idPaciente];
  if (filtros.fechaInicio && filtros.fechaFin) {
    query += "AND r.fecha_aplicacion BETWEEN ? AND ? ";
    parametros.push(filtros.fechaInicio, filtros.fechaFin);
  }

  let agruparPor = "";
  if (filtros.tipoReporte === "semanal") {
    agruparPor =
      "DATE_SUB(DATE(r.fecha_aplicacion), INTERVAL (DAYOFWEEK(r.fecha_aplicacion) - 2) DAY) ";
  } else if (filtros.tipoReporte === "mensual") {
    agruparPor = "DATE_FORMAT(r.fecha_aplicacion, '%Y-%m') ";
  } else {
    agruparPor = "DATE(r.fecha_aplicacion)";
  }

  if (filtros.puntajeMin) {
    query += "AND r.puntaje >= ? ";
    parametros.push(filtros.puntajeMin);
  }

  if (filtros.puntajeMax) {
    query += "AND r.puntaje <= ? ";
    parametros.push(filtros.puntajeMax);
  }

  query += "GROUP BY r.tipo_test ORDER BY total_aplicaciones DESC";

  try {
    const [rows] = await db.query(query, parametros);
    return rows;
  } catch (err) {
    console.log("Error al obtener reporte de diagnosticos más comunes:", err);
    throw err;
  }
};

export const reporteDiagnosticoProf = async (filtros = {}, idProfesional) => {
  let query = `
        SELECT CONCAT(pa.nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, '')) AS nombrePaciente,
        r.tipo_test, COUNT(*) AS total_aplicaciones, ROUND(AVG(r.puntaje), 2) AS promedio_puntaje,
        TIMESTAMPDIFF(YEAR, pa.fecha_nacimiento, CURDATE()) AS edad,
        MAX(r.fecha_aplicacion) AS ultima_fecha
        FROM ResultadoTest r
        INNER JOIN Paciente p ON p.idPaciente = r.idPaciente
        INNER JOIN Usuario pa ON pa.idUsuario = p.idUsuario
        WHERE r.idProfesional = ?        
    `;

  const parametros = [idProfesional];
  if (filtros.idPaciente) {
    query += "AND p.idPaciente = ? ";
    parametros.push(filtros.idPaciente);
  }

  if (filtros.fechaInicio && filtros.fechaFin) {
    query += "AND r.fecha_aplicacion BETWEEN ? AND ? ";
    parametros.push(filtros.fechaInicio, filtros.fechaFin);
  }

  let agruparPor = "";
  if (filtros.tipoReporte === "semanal") {
    agruparPor =
      "DATE_SUB(DATE(r.fecha_aplicacion), INTERVAL (DAYOFWEEK(r.fecha_aplicacion) - 2) DAY) ";
  } else if (filtros.tipoReporte === "mensual") {
    agruparPor = "DATE_FORMAT(r.fecha_aplicacion, '%Y-%m') ";
  } else {
    agruparPor = "DATE(r.fecha_aplicacion)";
  }

  if (filtros.puntajeMin) {
    query += "AND r.puntaje >= ? ";
    parametros.push(filtros.puntajeMin);
  }

  if (filtros.puntajeMax) {
    query += "AND r.puntaje <= ? ";
    parametros.push(filtros.puntajeMax);
  }

  query +=
    "GROUP BY p.idPaciente, r.tipo_test ORDER BY total_aplicaciones DESC";

  try {
    const [rows] = await db.query(query, parametros);
    return rows.length ? rows : [];
  } catch (err) {
    console.log("Error al obtener reporte de diagnosticos más comunes:", err);
    throw err;
  }
};
