import { db } from "../config/db.js";

export const createChatMessage = async ({
  idPaciente,
  idProfesional,
  mensaje,
  enviado,
}) => {
  let leidoProfesionalInicial = 0;
  let leidoPacienteInicial = 0;

  if (enviado === "profesional") {
    // Si el Profesional envía: lo marcó como leído para sí mismo (1), no leído para el paciente (0).
    leidoProfesionalInicial = 1;
    leidoPacienteInicial = 0;
  } else if (enviado === "paciente") {
    // Si el Paciente envía: lo marcó como leído para sí mismo (1), no leído para el profesional (0).
    leidoProfesionalInicial = 0;
    leidoPacienteInicial = 1;
  }
  const [result] = await db.query(
    `INSERT INTO Chat (idPaciente, idProfesional, mensaje, enviado, leido_profesional,  
        leido_paciente)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      idPaciente,
      idProfesional,
      mensaje,
      enviado,
      leidoProfesionalInicial,
      leidoPacienteInicial,
    ]
  );
  return result.insertId;
};

export const getChatMessages = async (idPaciente, idProfesional) => {
  const [rows] = await db.query(
    `SELECT c.*, 
            u1.Nombre AS nombreProfesional, 
            u2.Nombre AS nombrePaciente
     FROM Chat c
     LEFT JOIN Profesional p ON c.idProfesional = p.idProfesional
     LEFT JOIN Paciente pa ON c.idPaciente = pa.idPaciente
     LEFT JOIN Usuario u1 ON p.idUsuario = u1.idUsuario
     LEFT JOIN Usuario u2 ON pa.idUsuario = u2.idUsuario
     WHERE c.idPaciente = ? AND c.idProfesional = ?
     ORDER BY c.idChat ASC`,
    [idPaciente, idProfesional]
  );
  return rows;
};

export const getPacienteByChat = async (idChat) => {
  const [rows] = await db.query(
    `
    SELECT U.nombre AS nombrePaciente
    FROM Chat C
    INNER JOIN Paciente P ON C.idPaciente = P.idPaciente
    INNER JOIN Usuario U ON P.idUsuario = U.idUsuario
    WHERE C.idChat = ?
    `,
    [idChat]
  );
  return rows[0] || null;
};

// Pacientes que han enviado mensajes
export const obtenerPacientesPorProfesional = async (idProfesional) => {
  const [rows] = await db.query(
    `SELECT DISTINCT pa.idPaciente, u.Nombre, u.aPaterno, u.aMaterno
     FROM Chat c
     JOIN Paciente pa ON c.idPaciente = pa.idPaciente
     JOIN Profesional p ON c.idProfesional = p.idProfesional
     JOIN Usuario u ON pa.idUsuario = u.idUsuario
     WHERE p.idProfesional = ?`,
    [idProfesional]
  );
  return rows;
};

export const updateMensajesLeidos = async (
  idPaciente,
  idProfesional,
  lectorRol
) => {
  //  Determinar el campo de lectura a actualizar (leido_profesional o leido_paciente)
  const campoLectura =
    lectorRol === "profesional" ? "leido_profesional" : "leido_paciente";

  // Determinar el remitente que debe ser marcado como leído (el rol opuesto)
  const remitenteRequerido =
    lectorRol === "profesional" ? "paciente" : "profesional";

  //  Ejecutar la consulta
  const [result] = await db.query(
    // Usamos el campoLectura dinámicamente
    `UPDATE Chat SET ${campoLectura} = 1 
         WHERE idPaciente = ? 
           AND idProfesional = ? 
           AND enviado = ?`, // Filtro por remitente (solo mensajes recibidos)
    [idPaciente, idProfesional, remitenteRequerido]
  );

  return result;
};

export const obtenerMensajesNoLeidosModel = async (idProfesional) => {
  const [rows] = await db.query(
    `SELECT idPaciente, COUNT(*) AS noLeidos
     FROM Chat
     WHERE idProfesional = ? 
     AND enviado = 'paciente'
     AND leido_profesional = 0
     GROUP BY idPaciente`,
    [idProfesional]
  );

  const resultado = {};
  rows.forEach((row) => {
    resultado[row.idPaciente] = row.noLeidos;
  });

  return resultado;
};

export const obtenerMensajesNoLeidosPacModel = async (idPaciente) => {
  const [rows] = await db.query(
    `SELECT idProfesional, COUNT(*) AS noLeidos
     FROM Chat
     WHERE idPaciente = ? 
     AND enviado = 'profesional'
     AND leido_paciente = 0
     GROUP BY idProfesional`,
    [idPaciente]
  );

  const resultado = {};
  rows.forEach((row) => {
    resultado[row.idProfesional] = row.noLeidos;
  });

  return resultado;
};

export const obtenerMensajeCorreo = async (idPaciente, idProfesional) => {
  let rolTable = "";
  let rolId = null;
  const UMBRAL_INACTIVIDAD_MINUTOS = 120;

  if (idPaciente) {
    rolTable = "Paciente";
    rolId = idPaciente;
  } else if (idProfesional) {
    rolTable = "Profesional";
    rolId = idProfesional;
  } else {
    return null;
  }
  const [rows] = await db.query(
    `SELECT 
            u.idUsuario,
            u.email,
            CONCAT(u.Nombre, ' ', u.aPaterno) AS nombreCompleto,
            CASE 
                WHEN TIMESTAMPDIFF(MINUTE, u.activo, NOW()) <= ? AND u.activo IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END AS estaActivo
         FROM Usuario u 
         INNER JOIN ${rolTable} r ON u.idUsuario = r.idUsuario
         WHERE r.id${rolTable} = ?`,
    [rolId, UMBRAL_INACTIVIDAD_MINUTOS]
  );


  return rows[0] || null;
};
