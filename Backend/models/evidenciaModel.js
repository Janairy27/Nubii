import { db } from "../config/db.js";

// Creación de evidencias
export const createEvidencia = async (EvidenciaData) => {
  console.log("Datos obtenidos para insertar:", EvidenciaData);
  const [result] = await db.query(
    `
        INSERT INTO Evidencia
        (idPaciente, idActividad, fecha_sugerida, fecha_realizada, completada, satisfaccion, comentario_Evidencia)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      EvidenciaData.idPaciente,
      EvidenciaData.idActividad,
      EvidenciaData.fecha_sugerida,
      EvidenciaData.fecha_realizada,
      EvidenciaData.completada,
      EvidenciaData.satisfaccion,
      EvidenciaData.comentario_Evidencia,
    ]
  );
  console.log("Evidencia registrada");
  return result.insertId;
};

// Función que actualiza la actividad
export const updateEvidencia = async (idEvidencia, EvidenciaData) => {
  const [result] = await db.query(
    `UPDATE Evidencia SET
        fecha_realizada = ?, completada = ?, satisfaccion = ?, comentario_Evidencia = ?
        WHERE idEvidencia = ?`,
    [
      EvidenciaData.fecha_realizada,
      EvidenciaData.completada,
      EvidenciaData.satisfaccion,
      EvidenciaData.comentario_Evidencia,
      idEvidencia,
    ]
  );
  console.log("Evidencia actualizada");
  return result.affectedRows;
};

// Eliminar evidencia
export const deleteEvidencia = async (idEvidencia) => {
  const [rows] = await db.query("DELETE FROM Evidencia WHERE idEvidencia = ?", [
    idEvidencia,
  ]);
  return rows[0];
};

// Devolución de las evidencias registradas de forma descendente
export const getEvidenciaByPacienteDesc = async (idPaciente) => {
  const [rows] = await db.query(
    "SELECT * FROM Evidencia WHERE idPaciente = ? ORDER BY DESC",
    [idPaciente]
  );
  return rows[0];
};

// Busqueda de evidencias de forma dinamica para los pacientes
export const getEvidenciasByAtrribute = async (filtros = {}, idPaciente) => {
  let query = `
    SELECT e.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombrePaciente,
    CONCAT(a.nombreAct, ' ', a.duracion_minutos, ' min') AS nombreActividad
    FROM Evidencia e
    INNER JOIN Actividad a ON e.idActividad = a.idActividad
    INNER JOIN Paciente p ON e.idPaciente = p.idPaciente 
    INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
    WHERE p.idPaciente = ?
    `;

  const parametros = [idPaciente];
  if (filtros.nombreActividad) {
    query += "AND CONCAT(a.nombreAct, ' ', a.duracion_minutos) LIKE ?";
    parametros.push(`%${filtros.nombreActividad}%`);
  }

  if (filtros.fecha_sugerida) {
    query += "AND e.fecha_sugerida = ?";
    parametros.push(filtros.fecha_sugerida);
  }

  if (filtros.fecha_realizada) {
    query += "AND e.fecha_realizada = ?";
    parametros.push(filtros.fecha_realizada);
  }

  if (filtros.completada) {
    query += "AND e.completada = ?";
    parametros.push(filtros.completada);
  }

  if (filtros.satisfaccion) {
    query += "AND e.satisfaccion = ?";
    parametros.push(filtros.satisfaccion);
  }

  query += " ORDER BY idEvidencia DESC";

  try {
    const [rows] = await db.query(query, parametros);
    return rows;
  } catch (err) {
    console.log("Error al consultar evidencia:", err);
    throw err;
  }
};

// Función de búsqueda dinamica para los profesionales
export const getEvidenciasByAtrributeProf = async (
  filtros = {},
  idProfesional
) => {
  let query = `
    SELECT e.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombrePaciente,
    CONCAT(a.nombreAct, ' ', a.duracion_minutos, ' min') AS nombreActividad
    FROM Evidencia e
    INNER JOIN Actividad a ON e.idActividad = a.idActividad AND a.idProfesional = ?
    INNER JOIN Paciente p ON e.idPaciente = p.idPaciente
    INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
    WHERE e.completada = 2 
    `;

  const parametros = [idProfesional];
  if (filtros.nombrePaciente) {
    query += "AND CONCAT(u.Nombre, ' ', u.aPaterno, ' ', u.aMaterno) LIKE ? ";
    parametros.push(`%${filtros.nombrePaciente}%`);
  }

  if (filtros.nombreActividad) {
    query += "AND CONCAT(a.nombreAct, ' ', a.duracion_minutos) LIKE ? ";
    parametros.push(`%${filtros.nombreActividad}%`);
  }

  if (filtros.fecha_realizada) {
    query += "AND e.fecha_realizada = ? ";
    parametros.push(filtros.fecha_realizada);
  }

  if (filtros.satisfaccion) {
    query += "AND e.satisfaccion = ? ";
    parametros.push(filtros.satisfaccion);
  }

  query += "ORDER BY idEvidencia DESC ";

  try {
    const [rows] = await db.query(query, parametros);
    return rows;
  } catch (err) {
    console.log("Error al consultar evidencia:", err);
    throw err;
  }
};
