import { db } from "../config/db.js";

// Creación de los pacientes
export const createPaciente = async(id_usuario, nivel_estres_base, connection) => {
    const [result] = await connection.query(
        `INSERT INTO Paciente (idUsuario, nivel_estres) VALUES (?, ?)`,
        [id_usuario, nivel_estres_base]
    );
    return result.insertId;
};

// Actualización de el paciente
export const updatePaciente = async(id_usuario, nivel_estres, connection) => {
    await connection.query(
         `UPDATE Paciente SET nivel_estres = ? WHERE idUsuario = ?`,
        [nivel_estres || 5, id_usuario]
    );
};

// Eliminar relaciones entre pacientes
export const deleteRelacionPaciente = async (id_usuario, connection) => {
    await connection.query(`DELETE FROM Paciente WHERE idUsuario = ?`, [id_usuario]);
}; 

// Busqueda del paciente a través del id del usuario
export const findPacienteByUsuario = async(idUsuario) => {
    const[rows] = await db.query(`SELECT idPaciente,
        CONCAT(Nombre, ' ', aPaterno, ' ', aMaterno) AS nombre 
        FROM Usuario u
        INNER JOIN Paciente p ON u.idUsuario = p.idUsuario 
        WHERE u.idUsuario = ?`, [idUsuario]);
    return rows[0];
};
// Obtener id y nombre de todos los pacientes
export const FindPacientes = async() => {
    const[rows] = await db.query(`
        SELECT p.idPaciente, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(aMaterno, ' ')) AS nombrePaciente 
        FROM Usuario u 
        INNER JOIN Paciente p ON u.idUsuario = p.idUsuario`);
    return rows;
};

export const getUsuarioByPaciente = async (idPaciente) => {
    const [rows] = await db.query(
        `SELECT idUsuario FROM Paciente WHERE idPaciente = ?`,
        [idPaciente]
    );
    if (rows.length === 0) return null;
    return rows[0].idUsuario;
};