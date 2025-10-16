import {db} from "../config/db.js";

// Creación de un nuevo usuario 
export const createUser = async (userData, connection) => {
    const [result] = await connection.query(
        `INSERT INTO Usuario 
        (nombre, apaterno, amaterno, fecha_nacimiento, sexo, telefono, email, curp, estado, municipio, calle, tipo_usuario, contrasena)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userData.nombre,
            userData.apaterno, 
            userData.amaterno,
            userData.fecha_nacimiento,
            userData.sexo,
            userData.telefono,
            userData.email,
            userData.curp,
            userData.estado,
            userData.municipio,
            userData.calle,
            userData.tipo_usuario,
            userData.contrasena,
        ] 
    );

    return result.insertId; // Para devolver el id del usuario generado

};

// Actualización de la fecha en la que accedio el usuario 
export const changeDate = async (fecha, idUsuario) => {
    await db.query("UPDATE Usuario set activo = ? WHERE idUsuario = ?",[fecha, idUsuario]);
};

// Actualizar usuario base
export const updateUser = async (id_usuario, userData, connection) => {
    await connection.query(
        `UPDATE Usuario SET 
            Nombre = ?, aPaterno = ?, aMaterno = ?, fecha_nacimiento = ?, sexo = ?, telefono = ?, email = ?, curp = ?, 
            estado = ?, municipio = ?, calle = ?, contrasena = IFNULL(?, contrasena)
         WHERE idUsuario = ?`,
         [userData.Nombre,
            userData.aPaterno, 
            userData.aMaterno,
            userData.fecha_nacimiento,
            userData.sexo,
            userData.telefono,
            userData.email,
            userData.curp,
            userData.estado,
            userData.municipio,
            userData.calle,
            userData.contrasena || null,
            id_usuario
         ]
    );
};

// Actualizar solamente token de recuperación
export const setResetToken = async (idUsuario, token, expires, connection) => {
    await connection.query("UPDATE Usuario SET reset_token = ?, reset_token_expires = ? WHERE idUsuario = ?",
        [token, expires, idUsuario]
    );
};

// Actualizar contraseña
export const updatePassword = async(idUsuario, hashedPassword) => {
    await db.query("UPDATE Usuario SET contrasena = ?, reset_token = NULL, reset_token_expires = NULL WHERE idUsuario = ?",
        [hashedPassword, idUsuario]
    );
};

// Eliminar usuario base
export const deleteUser = async (id_usuario, connection) => {
    await connection.query(`DELETE FROM Usuario WHERE idUsuario = ?`, [id_usuario]);
}
 
// Obtener usuario por ID
export const findUserById = async(id_usuario) => {
    const  [rows] = await db.query(`SELECT * FROM Usuario WHERE idUsuario = ?`, [id_usuario]);
    return rows[0];
}

// Obtener información completa de ambos usuarios
export const findFullUserById = async(id_usuario) => {
    const  [rows] = await db.query(`SELECT u.*, p.nivel_estres,
        pr.especialidad, pr.cedula
        FROM Usuario u
        LEFT JOIN Paciente p ON u.idUsuario = p.idUsuario
        LEFT JOIN Profesional pr ON u.idUsuario = pr.idUsuario
        WHERE u.idUsuario = ?`, [id_usuario]);
    return rows[0];
}

// Busqueda de usuarios por gmail
export const findUserByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ? ", [email]);
    return rows[0];
};

// Busqueda en todas las tablas de usuarios y sus relaciones
export const findFullUserByEmail = async (email) => {
    const [rows] = await db.query(`SELECT u.*, p.nivel_estres,
        pr.especialidad, pr.cedula
        FROM Usuario u
        LEFT JOIN Paciente p ON u.idUsuario = p.idUsuario
        LEFT JOIN Profesional pr ON u.idUsuario = pr.idUsuario
        WHERE u.email = ?`, [email]);
    return rows[0];
};

// Busqueda del token generado
export const findUserByToken = async(token) => {
    const[rows] = await db.query("SELECT * FROM Usuario WHERE reset_token = ? AND reset_token_expires > NOW()", [token]);
    return rows[0];
};

// Obtención del nombre del usuario de acuerdo a su id
export const getFullName = async(idUsuario) => {
    const[rows] = await db.query("SELECT Nombre, aPaterno, Amaterno FROM Usuario WHERE idUsuario = ?", [idUsuario]);
    return rows[0];
}

// Busqueda de usuarios de acuerdo a criterios
export const findUserByAttribute = async(attributo, valor) => {
    const query = (`SELECT u.*, p.nivel_estres, pr.especialidad, pr.cedula
        FROM Usuario u 
        LEFT JOIN Paciente p ON u.idUsuario = p.idUsuario
        LEFT JOIN Profesional pr ON u.idUsuario = pr.idUsuario WHERE ${attributo} LIKE ?`);
    try{
        const [rows] = await db.query(query, [`%${valor}%`]);
        return rows; // Devolución de todos los que contengan el valor
    }catch(err) {
        console.error("Error en consulta: ", err);
        throw err;
    }
};


// Busqueda de usuarios dependiendo los filtros seleccionados 
export const getUsuariosByAttribute = async(filtros = {}) => {
    let query = `
        SELECT CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombreUsuario,
        u.fecha_nacimiento, u.sexo, u.email, u.estado, u.municipio, u.tipo_usuario, 
            CASE 
                WHEN u.tipo_usuario = 2 THEN pr.especialidad
                ELSE NULL
            END AS especialidad
        FROM Usuario u
        LEFT JOIN Profesional pr ON u.idUsuario = pr.idUsuario
        LEFT JOIN Paciente p ON u.idUsuario = p.idUsuario
        WHERE 1 = 1 
    `;

    const parametros = [];
    if(filtros.nombreUsuario){
        query += "AND CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) LIKE ? ";
        parametros.push(`%${filtros.nombreUsuario}%`);
    }

    if(filtros.email){
        query += "AND u.email LIKE ? ";
        parametros.push(`%${filtros.email}%`);
    }

    if(filtros.estado){
        query += "AND u.estado LIKE ? ";
        parametros.push(`%${filtros.estado}%`);
    }

    if(filtros.tipo_usuario){
        query += "AND u.tipo_usuario = ? ";
        parametros.push(filtros.tipo_usuario);
    }

    if(filtros.especialidad){
        query += "AND pr.especialidad = ? ";
        parametros.push(filtros.especialidad);
    }

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error en consulta:", err);
        throw err;
    }
};


