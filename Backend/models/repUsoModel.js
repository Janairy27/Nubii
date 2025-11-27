import { db } from "../config/db.js";

// Consulta que servira para obtener información del uso de la aplicación
export const reporteUsoAdm = async (filtros = {}) => {
  let query = `
        SELECT 
        CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombreUsuario,
        CASE 
            WHEN u.tipo_usuario = 2 THEN 'Profesional'
            WHEN u.tipo_usuario = 3 THEN 'Paciente'
            ELSE 'Otro'
        END AS tipo_usuario,
        COUNT(DISTINCT r.idResultadoTest) AS total_test_realizados,
        COUNT(DISTINCT CASE WHEN ev.completada = 2 THEN ev.idActividad END) AS actividades_completadas, 
        ROUND(AVG(CASE WHEN ev.completada = 2 THEN ev.satisfaccion END), 2) AS promedio_satisfaccion,
        COUNT(DISTINCT CASE WHEN a.idActividad IS NOT NULL THEN a.idActividad END) AS actividades_publicadas,
        COUNT(DISTINCT CASE WHEN r_prof.idResultadoTest IS NOT NULL THEN r_prof.idResultadoTest END) AS test_aplicados,
        MAX(GREATEST(IFNULL(ev.fecha_realizada, '0000-00-00'), IFNULL(r_prof.fecha_aplicacion, '0000-00-00'))) AS ultima_actividad,
        {{agruparPor}} AS periodo
        FROM Usuario u
        LEFT JOIN Paciente p ON p.idUsuario = u.idUsuario
        LEFT JOIN Profesional pr ON pr.idUsuario = u.idUsuario
        LEFT JOIN Evidencia ev ON ev.idPaciente = p.idPaciente
        LEFT JOIN Actividad a ON a.idProfesional = pr.idProfesional
        LEFT JOIN ResultadoTest r ON r.idPaciente = p.idPaciente
        LEFT JOIN ResultadoTest r_prof ON r_prof.idProfesional = pr.idProfesional
        WHERE u.tipo_usuario IN (2, 3)
    `;

  const parametros = [];
  if (filtros.fechaInicio && filtros.fechaFin) {
    query += `AND ((r.fecha_aplicacion BETWEEN ? AND ?)
            OR (ev.fecha_realizada BETWEEN ? AND ?)
            OR (a.fechaPublicado BETWEEN ? AND ?))`;
    parametros.push(
      filtros.fechaInicio,
      filtros.fechaFin,
      filtros.fechaInicio,
      filtros.fechaFin,
      filtros.fechaInicio,
      filtros.fechaFin
    );
  }

  if (filtros.tipoUsuario) {
    query += " AND u.tipo_usuario = ? ";
    parametros.push(filtros.tipoUsuario);
  }

  if (filtros.estado) {
    query += " AND u.estado LIKE ? ";
    parametros.push(`%${filtros.estado}%`);
  }

  if (filtros.municipio) {
    query += " AND u.municipio LIKE ? ";
    parametros.push(`%${filtros.municipio}%`);
  }

  if (filtros.nombreUsuario) {
    query += " AND CONCAT(u.Nombre, ' ', u.aPaterno, ' ', u.aMaterno) LIKE ? ";
    parametros.push(`%${filtros.nombreUsuario}%`);
  }

  let agruparPor = "";
  if (filtros.tipoReporte === "semanal") {
    agruparPor =
      "YEARWEEK(IFNULL(ev.fecha_realizada, r_prof.fecha_aplicacion), 1)";
  } else if (filtros.tipoReporte === "mensual") {
    agruparPor =
      "DATE_FORMAT(IFNULL(ev.fecha_realizada, r_prof.fecha_aplicacion), '%Y-%m')";
  } else {
    agruparPor = "DATE(IFNULL(ev.fecha_realizada, r_prof.fecha_aplicacion))";
  }

  query = query.replace("{{agruparPor}}", agruparPor);

  query +=
    "GROUP BY nombreUsuario, tipo_usuario ORDER BY tipo_usuario, nombreUsuario";

  try {
    const [rows] = await db.query(query, parametros);
    return rows.length ? rows : [];
  } catch (err) {
    console.log("Error al obtener reporte del uso del sistema:", err);
    throw err;
  }
};
