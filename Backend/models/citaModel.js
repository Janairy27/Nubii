import { db } from "../config/db.js";

// Creación de citas
export const createCita = async(fecha, CitaData) => {

  const d = new Date(fecha);

  const año = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  const horas = String(d.getHours()).padStart(2, "0");
  const minutos = String(d.getMinutes()).padStart(2, "0");


  const fechaFormateada = `${año}-${mes}-${dia} ${horas}:${minutos}`;
    const [result] = await db.query(`
        INSERT INTO Cita
        (idPaciente, idProfesional, fecha_cita, modalidad, enviado)
        VALUES (?, ?, ?, ?, ?)`,
    [
        CitaData.idPaciente,
        CitaData.idProfesional,
        fechaFormateada,
        CitaData.modalidad, 
        CitaData.enviado
    ]);
    console.log("Cita registrada");
    return result.insertId;
}; 

// Función que actualiza las citas tanto para pacientes 
export const updateCita = async(idCita, fecha, CitaData) => {

    //const fechaFormateada = new Date(fecha).toISOString().slice(0, 19).replace("T", " ");
    const [result] = await db.query(
        `UPDATE Cita SET
        fecha_cita = ?, modalidad = ?, enviado = ?
        WHERE idCita = ?`,
        [
            fecha,
            CitaData.modalidad,
            CitaData.enviado,
            idCita
        ]
    );
    console.log("Cita actualizada");
    return result.affectedRows;
};

// Función que actualiza las citas tanto para profesionales
export const updateCitaProf = async(idCita, CitaData) => {
    const [result] = await db.query(
        `UPDATE Cita SET
        duracion_horas = ?, enlace = ?, comentario = ?
        WHERE idCita = ?`,
        [
            CitaData.duracion_horas,
            CitaData.enlace,
            CitaData.comentario,
            idCita
        ]
    );
    console.log("Cita actualizada");
    return result.affectedRows;
};

// Eliminar citas
export const deleteCita = async(idCita) => {
    const [rows] = await db.query("DELETE FROM Cita WHERE idCita = ?", [idCita]);
    return rows[0];
};

// Función para obtener información de la cita a travez de su id
export const getInfoCita = async(idCita) => {
    const [rows] = await db.query("SELECT * FROM Cita WHERE idCita = ?", [idCita]);
    return rows[0];
};

// Sentencia para obtener informacion de las citas y mostrarla en el calendario
export const infoCita = async(idPaciente) => {
    const [rows] = await db.query(`
        SELECT c.*, CONCAT(pro.Nombre, ' ', pro.aPaterno, ' ', IFNULL(pro.aMaterno, ' ')) AS nombreProfesional
        FROM Cita c
        INNER JOIN Paciente pac ON c.idPaciente = pac.idPaciente 
        INNER JOIN Usuario pa ON pac.idUsuario = pa.idUsuario
        INNER JOIN Profesional prof ON prof.idProfesional = c.idProfesional
        INNER JOIN Usuario pro ON prof.idUsuario = pro.idUsuario
        WHERE c.idPaciente = ? 
    `, [idPaciente]);
    return rows;
};

export const infoCitaProf = async(idProfesional) => {
    const [rows] = await db.query(`
        SELECT c.*, CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, ' ')) AS nombrePaciente
        FROM Cita c
        INNER JOIN Paciente pac ON c.idPaciente = pac.idPaciente 
        INNER JOIN Usuario pa ON pac.idUsuario = pa.idUsuario
        INNER JOIN Profesional prof ON prof.idProfesional = c.idProfesional
        INNER JOIN Usuario pro ON prof.idUsuario = pro.idUsuario
        WHERE c.idProfesional = ? 
    `, [idProfesional]);
    return rows;
};
// Consulta para obtener el nombre de todos aquellos pacientes que cuentan con una cita registrada
export const obtenerPacientesCita = async(idProfesional) => {
    const [rows] = await db.query(`
        SELECT c.idPaciente, CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, ' ')) AS nombrePaciente
        FROM Cita c
        INNER JOIN Paciente pac ON c.idPaciente = pac.idPaciente 
        INNER JOIN Usuario pa ON pac.idUsuario = pa.idUsuario
        INNER JOIN Profesional prof ON prof.idProfesional = c.idProfesional
        INNER JOIN Usuario pro ON prof.idUsuario = pro.idUsuario
        WHERE c.idProfesional = ? GROUP BY c.idPaciente
    `, [idProfesional]);
    return rows;
};



// Busqueda de citas de forma dinamica para los profesionales 
export const getCitasByAtrributeProf = async(filtros = {}, idProfesional) => {
    let query = `
    SELECT c.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombrePaciente
    FROM Cita c
    INNER JOIN Profesional pr ON pr.idProfesional = c.idProfesional
    INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
    INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
    WHERE c.idProfesional = ? AND c.enviado = 2
    `;

    const parametros = [idProfesional];
    if(filtros.nombrePaciente){
        query += "AND CONCAT(u.Nombre, ' ', u.aPaterno, ' ', u.aMaterno) LIKE ? ";
        parametros.push(`%${filtros.nombrePaciente}%`);
    }

    if(filtros.fecha_cita){
        query += "AND c.fecha_cita LIKE ? ";
        parametros.push(`%${filtros.fecha_cita}%`);
    }

    if(filtros.modalidad){
        query += "AND c.modalidad = ? ";
        parametros.push(filtros.modalidad);
    }

    if(filtros.comentario){
        query += "AND c.comentario LIKE ? ";
        parametros.push(`%${filtros.comentario}%`);
    }

    query += "ORDER BY c.fecha_cita ASC ";

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error al consultar resultados de test:", err);
        throw err;
    }
};

// Busqueda de citas de forma dinamica para los pacientes 
export const getCitasByAtrributePac = async(filtros = {}, idPaciente) => {
    let query = `
    SELECT c.*, CONCAT(pro.Nombre, ' ', pro.aPaterno, ' ', IFNULL(pro.aMaterno, ' ')) AS nombreProfesional,
    CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, ' ')) AS nombrePaciente,
    prof.especialidad
    FROM Cita c
    INNER JOIN Paciente pac ON c.idPaciente = pac.idPaciente 
    INNER JOIN Usuario pa ON pac.idUsuario = pa.idUsuario
    INNER JOIN Profesional prof ON prof.idProfesional = c.idProfesional
    INNER JOIN Usuario pro ON prof.idUsuario = pro.idUsuario
    WHERE c.idPaciente = ?
    `;

    const parametros = [idPaciente];
    if(filtros.nombreProfesional){
        query += "AND CONCAT(pro.Nombre, ' ', pro.aPaterno, ' ', pro.aMaterno) LIKE ? ";
        parametros.push(`%${filtros.nombreProfesional}%`);
    }

    if(filtros.fecha_cita){
        query += "AND c.fecha_cita LIKE ? ";
        parametros.push(`%${filtros.fecha_cita}%`);
    }

    if(filtros.modalidad){
        query += "AND c.modalidad = ? ";
        parametros.push(filtros.modalidad);
    }

    if(filtros.comentario){
        query += "AND c.comentario LIKE ? ";
        parametros.push(`%${filtros.comentario}%`);
    }

    if(filtros.enviado){
        query += "AND c.enviado = ? ";
        parametros.push(filtros.enviado);
    }

    query += "ORDER BY c.fecha_cita DESC ";

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error al consultar resultados de citas:", err);
        throw err;
    }
};


// Busqueda de citas de forma dinamica para el usuario administrador
export const getCitasByAtrributeAdmin = async(filtros = {}) => {
    let query = `
    SELECT 
        c.*, 
        CONCAT(up.Nombre, ' ', up.aPaterno, ' ', IFNULL(up.aMaterno, ' ')) AS nombrePaciente,
        CONCAT(upr.Nombre, ' ', upr.aPaterno, ' ', IFNULL(upr.aMaterno, ' ')) AS nombreProfesional,
        prof.especialidad
    FROM Cita c
    -- Información del Paciente
    INNER JOIN Paciente pac ON c.idPaciente = pac.idPaciente 
    INNER JOIN Usuario up ON pac.idUsuario = up.idUsuario
    -- Información del Profesional
    INNER JOIN Profesional prof ON prof.idProfesional = c.idProfesional
    INNER JOIN Usuario upr ON prof.idUsuario = upr.idUsuario
    WHERE 1 = 1 -- Cláusula base para facilitar la adición de filtros
    `;

    const parametros = [];

    // Filtro por Nombre del Paciente
    if(filtros.nombrePaciente){
        query += "AND CONCAT(up.Nombre, ' ', up.aPaterno, ' ', up.aMaterno) LIKE ? ";
        parametros.push(`%${filtros.nombrePaciente}%`);
    }

    // Filtro por Nombre del Profesional
    if(filtros.nombreProfesional){
        query += "AND CONCAT(upr.Nombre, ' ', upr.aPaterno, ' ', upr.aMaterno) LIKE ? ";
        parametros.push(`%${filtros.nombreProfesional}%`);
    }

    // Filtro por Fecha de Cita
    if(filtros.fecha_cita){
        query += "AND c.fecha_cita LIKE ? ";
        parametros.push(`%${filtros.fecha_cita}%`);
    }

    // Filtro por Modalidad
    if(filtros.modalidad){
        query += "AND c.modalidad = ? ";
        parametros.push(filtros.modalidad);
    }

    // Filtro por Comentario
    if(filtros.comentario){
        query += "AND c.comentario LIKE ? ";
        parametros.push(`%${filtros.comentario}%`);
    }
    
    // Filtro por Estado de Envío (enviado)
    if(filtros.enviado){
        query += "AND c.enviado = ? ";
        parametros.push(filtros.enviado);
    }

    query += "ORDER BY c.fecha_cita DESC "; // Ordenar por fecha de cita

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error al consultar resultados de citas para administrador:", err);
        throw err;
    }
};