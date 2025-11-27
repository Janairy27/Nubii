import { reporteCitaProf, reporteCitasAdm } from "../models/repCitasModel.js";
import { generarExcel } from "../utils/ExcelCita.js";

// Función para obtener información y mostrarsela al profesional
export const infoCitaPorProfesional = async (req, res) => {
  try {
    const { idProfesional, idPaciente, fechaInicio, fechaFin, tipoReporte } =
      req.query;
    console.log("Parametros recibidos:", req.query);

    const filtros = {
      idPaciente: idPaciente ? parseInt(idPaciente) : undefined,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      tipoReporte: tipoReporte || undefined,
    };

    const informacion = await reporteCitaProf(filtros, parseInt(idProfesional));
    return res.json(informacion);
  } catch (err) {
    console.log("Error al obtener información del reporte:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Función para obtener la información que se le mostrará al administrador
export const infoCitaAdm = async (req, res) => {
  try {
    console.log("Parametros recibidos:", req.query);

    const informacion = await reporteCitasAdm();
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
      'attachment; filename="ReporteCita.xlsx'
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
