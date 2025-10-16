import {db} from "../config/db.js";

// Creación de Actividades
export const createActividad = async(ActividadData) =>{
    console.log("Datos recibidos para insertar:", ActividadData);
    const [result] = await db.query(`
        INSERT INTO Actividad
        (nombreAct, descripcionAct, tipoAct, duracion_minutos, dificultad, objetivo, multimedia, publico, idProfesional, fechaPublicado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        ActividadData.nombreAct,
        ActividadData.descripcionAct,
        ActividadData.tipoAct,
        ActividadData.duracion_minutos,
        ActividadData.dificultad,
        ActividadData.objetivo,
        ActividadData.multimedia,
        ActividadData.publico,
        ActividadData.idProfesional,
        ActividadData.fechaPublicado
    ]);
    console.log("Actividad registrada");
    return result.insertId;
};

// Actualización de actividades
export const updateActividad = async (idActividad, ActividadData) => {
    const [result] = await db.query(
        `UPDATE Actividad SET 
        nombreAct = ?, descripcionAct = ?, tipoAct = ?, duracion_minutos = ?,
        dificultad = ?, objetivo = ?, multimedia = ?, publico = ?
        WHERE idActividad = ?`,
        [
            ActividadData.nombreAct,
            ActividadData.descripcionAct,
            ActividadData.tipoAct,
            ActividadData.duracion_minutos,
            ActividadData.dificultad,
            ActividadData.objetivo,
            ActividadData.multimedia,
            ActividadData.publico,
            idActividad
        ]
    );
    console.log("Actividad actualizada");
    return result.affectedRows;
};

// Eliminar actividad
export const deleteActividad = async(idActividad) => {
    await db.query("DELETE FROM Actividad WHERE idActividad = ?", [idActividad]);
    console.log("Actividad eliminada");
}

// Busqueda de actividad por id que le pertenezca al usuario que la creo
export const findActividadById = async(idActividad, idProfesional, publico) => {
    const [rows] = await db.query("SELECT * FROM Actividad WHERE idActividad = ? AND idProfesional = ? AND publico = ?", [idActividad, idProfesional, publico]);
    return rows[0];
};

export const findActividadByActividad = async(idActividad) => {
    const[rows] = await db.query(`SELECT nombreAct, fechaPublicado FROM Actividad WHERE idActividad = ? AND publico = 2`, [idActividad]);
    return rows[0];
};

// Función que devuelve todas las actividades creados por el profesional mostrandolo de forma descendente del más nuevo al más antiguo
export const getActividadesByProfesionalDesc = async(idProfesional, publico) => {
    const [rows] = await db.query("SELECT * FROM Actividad WHERE idProfesional = ? AND publico = ? ORDER BY idActividad DESC", [idProfesional, publico]);
    return rows;
};

// Función para obtener los nombres de pacientes y profesionales, además del correo electronico
export const getInfoPacienteyProfesional = async(idActividad) =>{
    const [rows] = await db.query(`
        SELECT CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, ' ')) AS nombrePaciente,
        pa.email AS emailPaciente,
        CONCAT(pro.Nombre, ' ', pro.aPaterno, ' ', IFNULL(pro.aMaterno, ' ')) AS nombreProfesional
        FROM Actividad a 
        INNER JOIN Profesional pr ON a.idProfesional = pr.idProfesional 
        JOIN Usuario pro ON pr.idUsuario = pro.idUsuario
        JOIN Usuario pa 
        JOIN Paciente p ON pa.idUsuario = p.idUsuario
        WHERE DATEDIFF(NOW(), pa.activo) <= 1 AND a.idActividad = ? 
        `, [idActividad]);
    return rows;
};

// Búsqueda de actividades dependiendo del criterio para los profesionales
export const findActividadByAttributeProfesional = async(atributo, valor, idProfesional, publico) => {
    const query = (`SELECT * FROM Actividad WHERE ${atributo} LIKE ? AND idProfesional = ? AND publico = ?`);
    try{
        const [rows] = await db.query(query, [`%${valor}%`, idProfesional, publico]);
        return rows;
    }catch(err){
        console.log("Error en consulta:", err);
        throw err;
    }
};

// Obtener una actividad por ID
export const getActividadById = async (idActividad) => {
  const [rows] = await db.query(
    "SELECT * FROM Actividad WHERE idActividad = ?",
    [idActividad]
  );
  return rows[0];
};

// Búsqueda de actividades especifica para los pacientes
export const getActividadesByAttributeUsuarios = async(filtros = {}, idPaciente) => {
    let query = `
        SELECT a.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombreProfesional
        FROM Actividad a 
        INNER JOIN Profesional pr ON a.idProfesional = pr.idProfesional
        INNER JOIN Usuario u ON pr.idUsuario = u.idUsuario
        LEFT JOIN Evidencia e ON a.idActividad = e.idActividad AND e.idPaciente = ?
        WHERE a.publico = 2 AND e.idActividad IS NULL 
    `;

    const parametros = [idPaciente];
    if(filtros.nombreProfesional){
        query += "AND CONCAT(u.Nombre, ' ', u.aPaterno, ' ', u.aMaterno) LIKE ? ";
        parametros.push(`%${filtros.nombreProfesional}%`);
    }    

    if(filtros.nombreAct){
        query += "AND a.nombreAct LIKE ? ";
        parametros.push(`%${filtros.nombreAct}%`);
    }

    if(filtros.tipoAct){
        query += "AND a.tipoAct = ? ";
        parametros.push(filtros.tipoAct);
    }

    if(filtros.duracion_minutos){
        query += "AND a.duracion_minutos = ? ";
        parametros.push(filtros.duracion_minutos);
    }

    if(filtros.dificultad){
        query += "AND a.dificultad = ? ";
        parametros.push(filtros.dificultad);
    }

    query += "ORDER BY a.idActividad DESC";

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error en consulta:", err);
        throw err;
    }
};

// Búsqueda de actividades especifica para los administradores
export const getActividadesByAttributeAdmin = async(filtros = {}) => {
    let query = `
        SELECT a.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombreProfesional
        FROM Actividad a 
        INNER JOIN Profesional pr ON a.idProfesional = pr.idProfesional
        INNER JOIN Usuario u ON pr.idUsuario = u.idUsuario
        LEFT JOIN Evidencia e ON a.idActividad = e.idActividad
        WHERE a.publico = 2 
    `;

    const parametros = [];
    if(filtros.nombreProfesional){
        query += "AND CONCAT(u.Nombre, ' ', u.aPaterno, ' ', u.aMaterno) LIKE ? ";
        parametros.push(`%${filtros.nombreProfesional}%`);
    }    

    if(filtros.nombreAct){
        query += "AND a.nombreAct LIKE ? ";
        parametros.push(`%${filtros.nombreAct}%`);
    }

    if(filtros.tipoAct){
        query += "AND a.tipoAct = ? ";
        parametros.push(filtros.tipoAct);
    }

    if(filtros.duracion_minutos){
        query += "AND a.duracion_minutos = ? ";
        parametros.push(filtros.duracion_minutos);
    }

    if(filtros.dificultad){
        query += "AND a.dificultad = ? ";
        parametros.push(filtros.dificultad);
    }

    query += "ORDER BY a.idActividad DESC";

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error en consulta:", err);
        throw err;
    }
};
