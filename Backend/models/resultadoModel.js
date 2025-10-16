import { db } from "../config/db.js";

// Creación de resultados de test
export const createResultadoT = async(ResultadoData) => {
    console.log("Datos obtenidos para insertar:", ResultadoData);
    const [result] = await db.query(`
        INSERT INTO ResultadoTest
        (idProfesional, idPaciente, tipo_test, fecha_aplicacion, puntaje, categ_resultado, interpretacion, recomendacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        ResultadoData.idProfesional,
        ResultadoData.idPaciente,
        ResultadoData.tipo_test,
        ResultadoData.fecha_aplicacion, 
        ResultadoData.puntaje,
        ResultadoData.categ_resultado, 
        ResultadoData.interpretacion,
        ResultadoData.recomendacion,
    ]);
    console.log("Resultados registrados");
    return result.insertId;
}; 

// Función que actualiza los resultados
export const updateResultados = async(idResultadoTest, ResultadoData) => {
    const [result] = await db.query(
        `UPDATE ResultadoTest SET
        tipo_test = ?, puntaje = ?, categ_resultado = ?, 
        interpretacion = ?, recomendacion = ?
        WHERE idResultadoTest = ?`,
        [
            ResultadoData.tipo_test,
            ResultadoData.puntaje,
            ResultadoData.categ_resultado,
            ResultadoData.interpretacion,
            ResultadoData.recomendacion,
            idResultadoTest
        ]
    );
    console.log("Resultados actualizados");
    return result.affectedRows;
};

// Eliminar resultados de test
export const deleteResultados = async(idResultadoTest) => {
    const [rows] = await db.query("DELETE FROM ResultadoTest WHERE idResultadoTest = ?", [idResultadoTest]);
    return rows[0];
};






// Busqueda de evidencias de forma dinamica para los profesionales 
export const getResultadoByAtrributeProf = async(filtros = {}, idProfesional) => {
    let query = `
    SELECT r.*, CONCAT(u.Nombre, ' ', u.aPaterno, ' ', IFNULL(u.aMaterno, ' ')) AS nombrePaciente
    FROM ResultadoTest r
    INNER JOIN Profesional pr ON pr.idProfesional = r.idProfesional
    INNER JOIN Paciente p ON r.idPaciente = p.idPaciente 
    INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
    WHERE r.idProfesional = ?
    `;

    const parametros = [idProfesional];
    if(filtros.nombrePaciente){
        query += "AND CONCAT(u.Nombre, ' ', u.aPaterno, ' ', u.aMaterno) LIKE ? ";
        parametros.push(`%${filtros.nombrePaciente}%`);
    }

    if(filtros.tipo_test){
        query += "AND r.tipo_test LIKE ? ";
        parametros.push(`%${filtros.tipo_test}%`);
    }

    if(filtros.fecha_aplicacion){
        query += "AND r.fecha_aplicacion = ? ";
        parametros.push(filtros.fecha_aplicacion);
    }

    if(filtros.categ_resultado){
        query += "AND r.categ_resultado = ? ";
        parametros.push(filtros.categ_resultado);
    }

    if(filtros.interpretacion){
        query += "AND r.interpretacion LIKE ? ";
        parametros.push(`%${filtros.interpretacion}%`);
    }

    query += "ORDER BY r.fecha_aplicacion DESC ";

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error al consultar resultados de test:", err);
        throw err;
    }
};

// Busqueda de evidencias de forma dinamica para los pacientes 
export const getResultadoByAtrributePac = async(filtros = {}, idPaciente) => {
    let query = `
    SELECT r.*, CONCAT(pro.Nombre, ' ', pro.aPaterno, ' ', IFNULL(pro.aMaterno, ' ')) AS nombreProfesional,
    CONCAT(pa.Nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, ' ')) AS nombrePaciente,
    prof.especialidad
    FROM ResultadoTest r
    INNER JOIN Paciente pac ON r.idPaciente = pac.idPaciente 
    INNER JOIN Usuario pa ON pac.idUsuario = pa.idUsuario
    INNER JOIN Profesional prof ON prof.idProfesional = r.idProfesional
    INNER JOIN Usuario pro ON prof.idUsuario = pro.idUsuario
    WHERE r.idPaciente = ?
    `;

    const parametros = [idPaciente];
    if(filtros.nombreProfesional){
        query += "AND CONCAT(pro.Nombre, ' ', pro.aPaterno, ' ', pro.aMaterno) LIKE ? ";
        parametros.push(`%${filtros.nombreProfesional}%`);
    }

    if(filtros.tipo_test){
        query += "AND r.tipo_test LIKE ? ";
        parametros.push(`%${filtros.tipo_test}%`);
    }

    if(filtros.fecha_aplicacion){
        query += "AND r.fecha_aplicacion = ? ";
        parametros.push(filtros.fecha_aplicacion);
    }

    if(filtros.categ_resultado){
        query += "AND r.categ_resultado = ? ";
        parametros.push(filtros.categ_resultado);
    }

    if(filtros.interpretacion){
        query += "AND r.interpretacion LIKE ? ";
        parametros.push(`%${filtros.interpretacion}%`);
    }

    query += "ORDER BY r.fecha_aplicacion DESC ";

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error al consultar resultados de test:", err);
        throw err;
    }
};
