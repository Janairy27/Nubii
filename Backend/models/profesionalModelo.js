import { db } from "../config/db.js";

// Creación de profesionales
export const createProfesional = async (id_usuario, especialidad, cedula, connection) => {
    const [result] = await connection.query(
        `INSERT INTO Profesional (idUsuario, especialidad, cedula)
        VALUES (?, ?, ?)`,
        [id_usuario, especialidad, cedula]
    );
    return result.insertId;
};

// Actualizar información del profesional
export const updateProfesional = async(id_usuario, especialidad, cedula, connection) => {
    await connection.query(
         `UPDATE Profesional SET especialidad = ?, cedula = ? WHERE idUsuario = ?`,
        [especialidad, cedula, id_usuario]
    );
};

// Eliminar relaciones entre profesionales
export const deleteRelacionProfesional = async (id_usuario, connection) => {
    await connection.query(`DELETE FROM Profesional WHERE idUsuario = ?`, [id_usuario]);
}; 

// Busqueda del profesional a travéz del id usuario
export const findProfesionalByUsuario = async(idUsuario) => {
    const[rows] = await db.query(`SELECT idProfesional,
        CONCAT(Nombre, ' ', aPaterno, ' ', aMaterno) AS nombre 
        FROM Usuario u
        INNER JOIN Profesional pr ON u.idUsuario = pr.idUsuario 
        WHERE u.idUsuario = ?`, [idUsuario]);
    return rows[0];
};