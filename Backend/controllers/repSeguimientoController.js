import { reporteSeguimientoPac, reporteSeguimientoProf } from "../models/repSeguimientoModel.js";
import { generarPDF, PDFProfesional } from "../utils/PDFSeguimiento.js";

export const infoSeguimientoPaciente = async(req, res) => {
    try{
        const{idPaciente, fechaInicio, fechaFin, tipoReporte } = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
            tipoReporte: tipoReporte || undefined,
        };

        const informacion = await reporteSeguimientoPac(filtros, parseInt(idPaciente));
        return res.json(informacion);
    }catch(err){
        console.log("Error al obtener información del reporte:", err);
        return res.status(500).json({error: err.message});
    }
};

// Función para obtener información y mostrarsela al profesional
export const infoSeguimientoPorProfesional = async(req, res) => {
    try{
        const{idProfesional, idPaciente, fechaInicio, fechaFin, 
            emocionPredominante, intensidadMinima, intensidadMaxima, tipoTest ,tipoReporte } = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            idPaciente: idPaciente ? parseInt(idPaciente): undefined,
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
            emocionPredominante: emocionPredominante ? parseInt(emocionPredominante): undefined,
            intensidadMinima: intensidadMinima ? parseInt(intensidadMinima): undefined,
            intensidadMaxima: intensidadMaxima ? parseInt(intensidadMaxima): undefined,
            tipoTest: tipoTest || undefined,
            tipoReporte: tipoReporte || undefined,
        };
        
        const informacion = await reporteSeguimientoProf(filtros, parseInt(idProfesional));
        
        return res.json(informacion);
    }catch(err){
        console.log("Error al obtener información del reporte:", err);
        return res.status(500).json({error: err.message});
    }
};

// Función para exportar la información en archivo PDF
export const exportarPDF = async(req, res) => {
    try{
        const {tipoUsuario, datos, grafico} = req.body;
        let pdf;
        if (!tipoUsuario) return res.status(400).json({ error: "Tipo de usuario no proporcionado" });

        // Validar sobre que tipo de usuario es el que realiza el reporte
        if(tipoUsuario === 2){
            pdf = await PDFProfesional(datos, grafico);
        }else{
            pdf = await generarPDF(datos, grafico);
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="ReporteSeguimiento.pdf');
        res.send(pdf);
    }catch(err){
        console.log(err);
        res.status(500).json({err: "Error al generar PDF"});
    }
};