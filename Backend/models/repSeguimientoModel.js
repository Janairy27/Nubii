import { db } from "../config/db.js";

// Consulta en donde se muestra información únicamente del paciente
export const reporteSeguimientoPac = async(filtros = {}, idPaciente) => {
    let query = `
        SELECT {{agruparPor}} AS tiempo,
        s.emocion, AVG(s.intensidad) AS promedio_intensidad,
        COUNT(*) AS frecuencia_emocion
        FROM Sintoma s
        INNER JOIN Paciente p ON p.idPaciente = s.idPaciente
        INNER JOIN Usuario pa ON pa.idUsuario = p.idUsuario
        WHERE p.idPaciente = ?         
    `;

    const parametros = [idPaciente];
    if(filtros.fechaInicio && filtros.fechaFin){
        query += "AND s.fecha BETWEEN ? AND ? ";
        parametros.push(filtros.fechaInicio, filtros.fechaFin);
    }

    let agruparPor = "";
    if(filtros.tipoReporte === "semanal"){
        agruparPor = "DATE_SUB(DATE(s.fecha), INTERVAL (DAYOFWEEK(s.fecha) - 2) DAY) ";
    }else if(filtros.tipoReporte === "mensual"){
        agruparPor = "DATE_FORMAT(s.fecha, '%Y-%m') ";
    }else{
        agruparPor = "DATE(s.fecha) ";
    }

    query = query.replace("{{agruparPor}}", agruparPor);
    
    query += "GROUP BY s.fecha, s.emocion ORDER BY s.fecha ASC";

    try{
        const [rows] = await db.query(query, parametros);
        return rows;
    }catch(err){
        console.log("Error al obtener reporte de seguimiento individual:", err);
        throw err;
    }
};

// Consulta para obtener la información necesario y mostrarla al profesional
export const reporteSeguimientoProf = async(filtros = {}, idProfesional) => {
    let query = `
        SELECT
        CONCAT(pa.nombre, ' ', pa.aPaterno, ' ', IFNULL(pa.aMaterno, '')) AS nombrePaciente,
        {{agruparPor}} AS periodo, COUNT(s.idSintoma) AS total_sintomas,
        ROUND(AVG(s.intensidad), 2) AS promedio_intensidad_emocional,
        h.emocion_predom AS emocion_predominante,
        h.prom_intensidad AS intensidad_prom_historial,
        h.nivel_dominante AS nivel_dominante_historial,
        r.tipo_test AS ultimo_test, r.puntaje AS puntaje_test,
        r.categ_resultado AS categoria_test,
        r.fecha_aplicacion AS fecha_ultimo_test
        FROM Paciente p
        INNER JOIN Usuario pa ON pa.idUsuario = p.idUsuario
        LEFT JOIN Sintoma s ON s.idPaciente = p.idPaciente
        LEFT JOIN Historial h ON h.idPaciente = p.idPaciente
        LEFT JOIN (SELECT r1.*
            FROM ResultadoTest r1
            INNER JOIN (
                SELECT idPaciente, MAX(fecha_aplicacion) AS ultima_fecha
                FROM ResultadoTest GROUP BY idPaciente 
            ) r2 ON r1.idPaciente = r2.idPaciente AND r1.fecha_aplicacion = r2.ultima_fecha
        ) r ON r.idPaciente = p.idPaciente
        WHERE r.idProfesional = ? 
    `;

    const parametros = [idProfesional];
    if(filtros.idPaciente){
        query += "AND p.idPaciente = ? ";
        parametros.push(filtros.idPaciente);
    }

    if(filtros.fechaInicio && filtros.fechaFin){
        query += "AND r.fecha_aplicacion BETWEEN ? AND ? ";
        parametros.push(filtros.fechaInicio, filtros.fechaFin);
    }

    if (filtros.emocionPredominante) {
        query += "AND h.emocion_predom = ? ";
        parametros.push(filtros.emocionPredominante);
    }

    if (filtros.intensidadMinima) {
        query += "AND s.intensidad >= ? ";
        parametros.push(filtros.intensidadMinima);
    }

    if (filtros.intensidadMaxima) {
        query += "AND s.intensidad <= ? ";
        parametros.push(filtros.intensidadMaxima);
    }

    if (filtros.tipoTest) {
        query += "AND r.tipo_test = ? ";
        parametros.push(filtros.tipoTest);
    }

    let agruparPor = "";
    if(filtros.tipoReporte === "semanal"){
        agruparPor = "DATE_SUB(DATE(r.fecha_aplicacion), INTERVAL (DAYOFWEEK(r.fecha_aplicacion) - 2) DAY) ";
    }else if(filtros.tipoReporte === "mensual"){
        agruparPor = "DATE_FORMAT(r.fecha_aplicaciona, '%Y-%m') ";
    }else{
        agruparPor = "DATE(r.fecha_aplicacion)";
    }

    query = query.replace("{{agruparPor}}", agruparPor);

    query += `GROUP BY nombrePaciente ORDER BY nombrePaciente`;

    try{
        const [rows] = await db.query(query, parametros);
        return rows.length ? rows: [];
    }catch(err){
        console.log("Error al obtener reporte de seguimiento emocional:", err);
        throw err;
    }
};

