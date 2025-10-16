import {db} from "../config/db.js";

// Creación de recordatorios
export const createRecordatorio = async(RecordatorioData) => {
    console.log("Datos recibidos para insertar:", RecordatorioData);
    const [result] = await db.query(
        `INSERT INTO Recordatorio
        (mensaje, hora, frecuencia, tipo_recordatorio, idUsuario, notificacion)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            RecordatorioData.mensaje,
            RecordatorioData.hora,
            RecordatorioData.frecuencia,
            RecordatorioData.tipo_recordatorio,
            RecordatorioData.idUsuario,
            RecordatorioData.notificacion
        ]);
    console.log("Recordatorio registrado");
    return result.insertId;
};

// Función para actualizar el recordatorio
export const updateRecordatorio = async(idRecordatorio, RecordatorioData) => {
    const [result] = await db.query(
        `UPDATE Recordatorio SET
        mensaje = ?, hora = ?, frecuencia = ?, tipo_recordatorio = ?, culminado = ?, notificacion = ?
        WHERE idRecordatorio = ?`,
        [
            RecordatorioData.mensaje,
            RecordatorioData.hora,
            RecordatorioData.frecuencia,
            RecordatorioData.tipo_recordatorio,
            RecordatorioData.culminado,
            RecordatorioData.notificacion,
            idRecordatorio
        ]
    );
    console.log("Recordatorio actualizado");
    return result.affectedRows;
};

// Eliminar recordatorio
export const deleteRecordatorio = async(idRecordatorio) => {
    const [rows] = await db.query("DELETE FROM Recordatorio WHERE idRecordatorio = ?", [idRecordatorio]);
    return rows[0];
};

// Función de búsqueda dinámica para todos los usuarios
export const getRecordatorioByAttribute = async(filtros =  {}, idUsuario) => {
    let query = `
        SELECT r.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(aMaterno, ' ')) AS nombreUsuario
        FROM Recordatorio r
        INNER JOIN Usuario u ON r.idUsuario = u.idUsuario 
        WHERE r.idUsuario = ? 
    `;

    const parametros = [idUsuario];
    if(filtros.mensaje){
        query += "AND r.mensaje LIKE ? ";
        parametros.push(`%${filtros.mensaje}%`);
    }

    if(filtros.hora){
        query += "AND r.hora LIKE ? ";
        parametros.push(`%${filtros.hora}%`);
    }

    if(filtros.frecuencia){
        query += "AND r.frecuencia = ? ";
        parametros.push(filtros.frecuencia);
    }

    if(filtros.tipo_recordatorio){
        query += "AND r.tipo_recordatorio = ? ";
        parametros.push(`%${filtros.tipo_recordatorio}%`);
    }

    //query += "ORDER BY r.fecha DESC ";

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error al consultar recordatorios:", err);
        throw err;
    }
};



// Función que permite obtener los recordatorios
export const obtenerPendientes = async() => {
    const [rows] = await db.query(`
        SELECT r.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombreUsuario,
        u.email FROM Recordatorio r 
        INNER JOIN Usuario u ON r.idUsuario = u.idUsuario
        WHERE culminado = 1 AND enviado = 0`
    );
    return rows;
};

// Función que actualiza el estado de envio
export const marcadoEnviado = async(idRecordatorio) => {
    await db.query(`UPDATE Recordatorio SET enviado = 1, fechaEnvio = NOW()
        WHERE idRecordatorio = ?`, [idRecordatorio]);
    console.log("Estado modificado");
};

// Creación de la notificación
export const notificacionInterna = async(idUsuario, mensaje) => {
    await db.query(`
        INSERT INTO Notificacion (idUsuario, mensaje, leído, fecha)
        VALUES (?, ?, 0, NOW())`,[idUsuario, mensaje]);
};
