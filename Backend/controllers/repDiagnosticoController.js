import {
  reporteDiagnosticoPac,
  reporteDiagnosticoProf,
} from "../models/repDiagnosticosModel.js";
import { generarPDF, PDFProfesional } from "../utils/PDFDiagnostico.js";

export const infoDiagnosticoPaciente = async (req, res) => {
  try {
    const {
      idPaciente,
      fechaInicio,
      fechaFin,
      tipoReporte,
      puntajeMin,
      puntajeMax,
    } = req.query;
    console.log("Parametros recibidos:", req.query);

    const filtros = {
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      tipoReporte: tipoReporte || undefined,
      puntajeMin: puntajeMin ? parseInt(puntajeMin) : undefined,
      puntajeMax: puntajeMax ? parseInt(puntajeMax) : undefined,
    };

    const informacion = await reporteDiagnosticoPac(
      filtros,
      parseInt(idPaciente)
    );
    return res.json(informacion);
  } catch (err) {
    console.log("Error al obtener información del reporte:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Función para obtener información y mostrarsela al profesional
export const infoDiagnosticoPorProfesional = async (req, res) => {
  try {
    const {
      idProfesional,
      idPaciente,
      nombrePaciente,
      fechaInicio,
      fechaFin,
      tipoReporte,
      puntajeMin,
      puntajeMax,
    } = req.query;
    console.log("Parametros recibidos:", req.query);

    const filtros = {
      idPaciente: idPaciente ? parseInt(idPaciente) : undefined,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      tipoReporte: tipoReporte || undefined,
      puntajeMin: puntajeMin ? parseInt(puntajeMin) : undefined,
      puntajeMax: puntajeMax ? parseInt(puntajeMax) : undefined,
    };

    const informacion = await reporteDiagnosticoProf(
      filtros,
      parseInt(idProfesional)
    );
    return res.json(informacion);
  } catch (err) {
    console.log("Error al obtener información del reporte:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Función para exportar la información en archivo PDF
export const exportarPDF = async (req, res) => {
  try {
    const { tipoUsuario, datos, grafico } = req.body;
    let pdf;
    if (!tipoUsuario)
      return res
        .status(400)
        .json({ error: "Tipo de usuario no proporcionado" });

    // Validar sobre que tipo de usuario es el que realiza el reporte
    if (tipoUsuario === 2) {
      pdf = await PDFProfesional(datos, grafico);
    } else {
      pdf = await generarPDF(datos, grafico);
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ReporteDiagnostico.pdf'
    );
    res.send(pdf);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Error al generar PDF" });
  }
};
