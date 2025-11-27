import {
  reporteEmocional,
  reporteEmocionalProf,
} from "../models/RepEmocionalModel.js";
import { generarExcel } from "../utils/ExcelEmocional.js";
import { generarPDF, PDFProfesional } from "../utils/PDFEmocional.js";

export const infoEmocionalPaciente = async (req, res) => {
  try {
    const { idPaciente, fechaInicio, fechaFin, tipoReporte } = req.query;
    console.log("Parametros recibidos:", req.query);
    if (!idPaciente) {
      return res
        .status(400)
        .json({ error: "El ID del paciente es obligatorio." });
    }

    // Convertir y verificar que el resultado sea un número válido
    const idPacienteNum = parseInt(idPaciente, 10);

    if (isNaN(idPacienteNum) || idPacienteNum <= 0) {
      return res
        .status(400)
        .json({
          error:
            "El ID del paciente es inválido (debe ser un número entero positivo).",
        });
    }

    const filtros = {
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      tipoReporte: tipoReporte || undefined,
    };

    const informacion = await reporteEmocional(filtros, parseInt(idPaciente));
    return res.json(informacion);
  } catch (err) {
    console.log("Error al obtener información del reporte:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Función para obtener información y mostrarsela al profesional
export const infoEmocionalPorProfesional = async (req, res) => {
  try {
    const {
      idProfesional,
      idPaciente,
      nombrePaciente,
      fechaInicio,
      fechaFin,
      tipoReporte,
    } = req.query;
    console.log("Parametros recibidos:", req.query);

    const filtros = {
      idPaciente: idPaciente ? parseInt(idPaciente) : undefined,
      nombrePaciente: nombrePaciente || undefined,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      tipoReporte: tipoReporte || undefined,
    };

    const informacion = await reporteEmocionalProf(
      filtros,
      parseInt(idProfesional)
    );
    return res.json(informacion);
  } catch (err) {
    console.log("Error al obtener información del reporte:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Función para exportar la información en excel
export const exportarExcel = async (req, res) => {
  try {
    const { datos } = req.body;
    const excel = await generarExcel(datos);
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ReporteEmocional.xlsx'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excel);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Error al generar Excel" });
  }
};

// Función para exportar la información en archivo PDF
export const exportarPDF = async (req, res) => {
  // console.log("Parámetros enviados:", {  fechaInicio, fechaFin, tipoReporte });

  try {
    const { tipoUsuario, datos, grafico, nombre, tipoReporte } = req.body;
    // console.log("Parámetros recibidos:", req.query);

    if (!tipoUsuario)
      return res
        .status(400)
        .json({ error: "Tipo de usuario no proporcionado" });

    let pdf;
    // Validar sobre que tipo de usuario es el que realiza el reporte
    if (tipoUsuario === 2) {
      pdf = await PDFProfesional(datos, grafico, nombre, tipoReporte);
    } else {
      console.log("Datos recibidos para PDF:", datos);
      pdf = await generarPDF(datos, grafico, nombre, tipoReporte);
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ReporteEmocional.pdf"'
    );
    res.send(pdf);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Error al generar PDF" });
  }
};
