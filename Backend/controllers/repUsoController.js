import { reporteUsoAdm } from "../models/repUsoModel.js";
import { generarPDF } from "../utils/PDFUso.js";

// Función para obtener información y mostrarsela al administrador
export const infoUso = async(req, res) => {
    try{
        const{fechaInicio, fechaFin, tipoUsuario, estado, municipio, nombreUsuario, tipoReporte } = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
            tipoUsuario: tipoUsuario ? parseInt(tipoUsuario): undefined,
            estado: estado || undefined,
            municipio: municipio || undefined,
            nombreUsuario: nombreUsuario || undefined,
            tipoReporte: tipoReporte || undefined,
        };

        const informacion = await reporteUsoAdm(filtros);
        return res.json(informacion);
    }catch(err){
        console.log("Error al obtener información del reporte:", err);
        return res.status(500).json({error: err.message});
    }
};

// Función para exportar la información en archivo PDF
export const exportarPDF = async(req, res) => {
    try{
        const {datos, grafico} = req.body;
        const pdf = await generarPDF(datos, grafico);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="ReporteUso.pdf');
        res.send(pdf);
    }catch(err){
        console.log(err);
        res.status(500).json({err: "Error al generar PDF"});
    }
};

