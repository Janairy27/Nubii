import { db } from "../config/db.js";


// Almacenamiento de actividad recomendada
export const createRecomendacion = async(RecomendacionData) => {
    console.log("Datos obtenidos para insertar:", RecomendacionData);
    const [result] = await db.query(`
        INSERT INTO Recomendacion
        (idProfesional, idPaciente, actividad, descripcion, publico)
        VALUES (?, ?, ?, ?, ?)`,
    [
        RecomendacionData.idProfesional,
        RecomendacionData.idPaciente,
        RecomendacionData.actividad,
        RecomendacionData.descripcion, 
        RecomendacionData.publico,
    ]);
    console.log("Actividad recomendada registrada");
   
    return result.insertId;
}; 

// Actualizar actividad recomendada
export const modifyRecomendacion = async(idRecomendacion, RecomendacionData) => {
    const [result] = await db.query(`
        UPDATE Recomendacion
        SET actividad = ?, descripcion = ?, publico = ?
        WHERE idRecomendacion = ?`,
    [
        RecomendacionData.actividad,
        RecomendacionData.descripcion, 
        RecomendacionData.publico,
        idRecomendacion
    ]);
    console.log("Actividad recomendada modificada");
    return result.affectedRows;
}; 

// Actualizar actividad por parte de los pacientes
export const modifyRecomendacionPaciente = async(idRecomendacion, RecomendacionData) => {
    console.log(`[DB] Actualizando ID ${idRecomendacion} con mejoramiento: ${RecomendacionData.mejoramiento}`);
    const [result] = await db.query(`
        UPDATE Recomendacion 
        SET mejoramiento = ?, mas_recomendacion = ?
        WHERE idRecomendacion = ?
    `,[
        RecomendacionData.mejoramiento, 
        RecomendacionData.mas_recomendacion, 
        idRecomendacion
    ]);
    console.log(`[DB] Filas afectadas: ${result.affectedRows}`); // <-- ¡Añade este log!
    return result.affectedRows;
    return result.affectedRows;
};

// Obtención de información de las recomendaciones
export const obtenerRecomendaciones = async(idProfesional, publico) => {
    const [rows] = await db.query(`
        SELECT r.*, CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, ' ')) AS nombrePaciente
        FROM Recomendacion r 
        INNER JOIN Profesional pro ON pro.idProfesional = r.idProfesional
        INNER JOIN Paciente pac ON pac.idPaciente = r.idPaciente
        INNER JOIN Usuario pa ON pa.idUsuario = pac.idUsuario
        WHERE r.idProfesional = ? AND r.publico = ?
    `,[idProfesional, publico]);
    return rows;
};

export const obtenerRecomendacionesPac = async(idPaciente) => {
    const [rows] = await db.query(`
        SELECT r.*, CONCAT(prof.Nombre, ' ', prof.aPaterno, ' ', IFNULL(prof.aMaterno, ' ')) AS nombreProfesional
        FROM Recomendacion r
        INNER JOIN Paciente pac ON pac.idPaciente = r.idPaciente
        INNER JOIN Profesional pro ON pro.idProfesional = r.idProfesional
        INNER JOIN Usuario prof ON pro.idUsuario = prof.idUsuario
        WHERE r.idPaciente AND r.publico = 2
    `, [idPaciente]);
    return rows;
};

// Obtención de la actividad recomendada desde su id
export const getActividadById= async(idRecomendacion) => {
    const [rows] = await db.query("SELECT * FROM Recomendacion WHERE idRecomendacion = ?", [idRecomendacion]);
    return rows[0];
};

//Obtener el profesional de la recomendacion
export const getRecomendacionById = async (idRecomendacion) => {
  const [rows] = await db.query(
    "SELECT idProfesional, actividad FROM Recomendacion WHERE idRecomendacion = ?",
    [idRecomendacion]
  );
  return rows[0] || null;
};

export const getPacienteByRecomendacion = async (idRecomendacion) => {
  const [rows] = await db.query(
    `
    SELECT U.nombre AS nombrePaciente
    FROM Recomendacion R
    INNER JOIN Paciente P ON R.idPaciente = P.idPaciente
    INNER JOIN Usuario U ON P.idUsuario = U.idUsuario
    WHERE R.idRecomendacion = ?
    `,
    [idRecomendacion]
  );
  return rows[0] || null;
};
