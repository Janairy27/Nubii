import { db } from "../config/db.js";

// Creación de sintomas
export const createSintoma = async (SintomaData) => {
  console.log("Datos recibidos para insertar:", SintomaData);
  const [result] = await db.query(
    `INSERT INTO Sintoma
        (idPaciente, fecha, emocion, intensidad, detonante, ubicacion, clima, actividadReciente, nota)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      SintomaData.idPaciente,
      SintomaData.fecha,
      SintomaData.emocion,
      SintomaData.intensidad,
      SintomaData.detonante,
      SintomaData.ubicacion,
      SintomaData.clima,
      SintomaData.actividadReciente,
      SintomaData.nota,
    ]
  );
  console.log("Sintoma insertado");
  return result.insertId; // Devolución del id generado
};

// Actualización de sintoma
export const updateSintoma = async (idSintoma, SintomaData) => {
  const [result] = await db.query(
    `UPDATE Sintoma SET
        emocion = ?, intensidad = ?, detonante = ?, ubicacion = ?, clima = ?,
        actividadReciente = ?, nota = ?
        WHERE idSintoma = ?`,
    [
      SintomaData.emocion,
      SintomaData.intensidad,
      SintomaData.detonante,
      SintomaData.ubicacion,
      SintomaData.clima,
      SintomaData.actividadReciente,
      SintomaData.nota,
      idSintoma,
    ]
  );
  console.log("Sintoma actualizado");
  return result.affectedRows;
};

// Eliminar sintoma
export const deleteSintoma = async (idSintoma) => {
  await db.query("DELETE FROM Sintoma WHERE idSintoma = ?", [idSintoma]);
  console.log("Sintoma eliminado");
};

// Eliminar sintomas correspondientes a un usuario
export const deleteSintomaPaciente = async (idPaciente) => {
  await db.query("DELETE FROM Sintoma WHERE idPaciente = ?", [idPaciente]);
};

// Busqueda de sintoma por id que corresponda al paciente que lo registro
export const findSintomaById = async (idSintoma, idPaciente) => {
  const [rows] = await db.query(
    "SELECT * FROM Sintoma WHERE idSintoma = ? AND idPaciente = ?",
    [idSintoma, idPaciente]
  );
  return rows[0];
};

// Función que devuelve todos los síntomas creados por el usuario mostrandolos de forma descendente
export const getSintomasByPacienteDesc = async (idPaciente) => {
  const [rows] = await db.query(
    "SELECT * FROM Sintoma WHERE idPaciente = ? ORDER BY fecha DESC",
    [idPaciente]
  );
  return rows;
};

// Busqueda dinamica de sintomas para la vista de profesionales
export const findSintomaByAttribute = async (filtros = {}) => {
  let query = `
    SELECT s.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(aMaterno, ' ')) AS nombrePaciente,
    p.nivel_estres
    FROM Sintoma s
    INNER JOIN Paciente p ON p.idPaciente = s.idPaciente
    INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
    WHERE 1 = 1 
    `;

  const parametros = [];
  if (filtros.nombrePaciente) {
    query += "AND CONCAT(u.Nombre, ' ', u.aPaterno, ' ', u.aMaterno) LIKE ? ";
    parametros.push(`%${filtros.nombrePaciente}%`);
  }

  if (filtros.nivel_estres) {
    query += "AND p.nivel_estres = ? ";
    parametros.push(filtros.nivel_estres);
  }

  if (filtros.fecha) {
    query += "AND s.fecha = ? ";
    parametros.push(filtros.fecha);
  }

  if (filtros.emocion) {
    query += "AND s.emocion = ? ";
    parametros.push(filtros.emocion);
  }

  if (filtros.intensidad) {
    query += "AND s.intensidad = ? ";
    parametros.push(filtros.intensidad);
  }

  if (filtros.clima) {
    query += "AND s.clima = ? ";
    parametros.push(filtros.clima);
  }

  query += "ORDER BY idSintoma DESC";

  try {
    const [rows] = await db.query(query, parametros);
    return rows;
  } catch (err) {
    console.log("Error al consultar sintomas:", err);
    throw err;
  }
};

// Busqueda de sintomas dependiendo del criterio de busqueda
export const findSintomaByAttributePaciente = async (
  attributo,
  valor,
  idPaciente
) => {
  const query = `SELECT * FROM Sintoma WHERE ${attributo} LIKE ? AND idPaciente = ?`;
  try {
    const [rows] = await db.query(query, [`%${valor}%`, idPaciente]);
    return rows;
  } catch (err) {
    console.error("Error en consulta:", err);
    throw err;
  }
};
