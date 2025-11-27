import {
  reporteProfesionalesAdm,
  reporteAgendadosProf,
} from "../models/repProfAgendadosModel.js";
import { generarExcel } from "../utils/ExcelProfAgendados.js";

// Función para obtener información y mostrarsela al administrador
export const infoCitasAgAdmin = async (req, res) => {
  try {
    const {
      nombreProfesional,
      especialidad,
      citasMin,
      citasMax,
      fechaInicio,
      fechaFin,
      tipoReporte,
    } = req.query;
    console.log("Parametros recibidos:", req.query);

    const filtros = {
      nombreProfesional: nombreProfesional || undefined,
      especialidad: especialidad ? parseInt(especialidad) : undefined,
      citasMin: citasMin ? parseInt(citasMin) : undefined,
      citasMax: citasMax ? parseInt(citasMax) : undefined,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      tipoReporte: tipoReporte || undefined,
    };

    const informacion = await reporteProfesionalesAdm(filtros);
    return res.json(informacion);
  } catch (err) {
    console.log("Error al obtener información del reporte:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Función que manda a llamar la consulta del modelo para ser mostrada en los profesionales
export const infoAgendadosProf = async (req, res) => {
  try {
    const {
      idProfesional,
      nombrePaciente,
      fechaInicio,
      fechaFin,
      tipoReporte,
    } = req.query;
    console.log("Parametros recibidos:", req.query);

    const filtros = {
      nombrePaciente: nombrePaciente || undefined,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      tipoReporte: tipoReporte || undefined,
    };

    const informacion = await reporteAgendadosProf(
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
    // Llamada de la función en donde se establece el Excel
    const excel = await generarExcel(datos);
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ReporteProfesionalesAgendados.xlsx'
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
