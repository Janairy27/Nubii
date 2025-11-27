import {
  createHistorial,
  getHistoriaByPaciente,
  getSintomasByPaciente,
  getHistorial,
} from "../models/historialModel.js";

import { validarParrafos } from "../utils/validaciones.js";

// Registro de historial
export const registrarHistorial = async (req, res) => {
  console.log("Información obtenida:", req.body);

  const { fecha_inicio, fecha_fin, comentario } = req.body;
  const idPaciente = Number(req.body.idPaciente);
  const emocion_predom = Number(req.body.emocion_predom);
  const prom_intensidad = Number(req.body.prom_intensidad);
  let nivel_dominante = null;

  try {
    // Validación de campos nulos
    if (!fecha_inicio)
      return res.status(404).json({ message: "Fecha de inicio obligatoria" });
    if (!fecha_fin)
      return res.status(404).json({ message: "Fecha de fin obligatoria" });
    if (!emocion_predom)
      return res.status(404).json({ message: "Emoción obligatoria" });
    if (!prom_intensidad)
      return res
        .status(404)
        .json({ message: "Promedio de intensidad obligatorio" });

    // Validar formato de comentario
    const errores = validarParrafos(comentario);
    if (errores > 0) {
      return res
        .status(400)
        .json({
          message: "Favor de cumplir con el formato solicitado",
          errores,
        });
    }

    // Obtención de la diferencia de dias en los sintomas
    const total_dias =
      (new Date(fecha_fin) - new Date(fecha_inicio)) / (1000 * 60 * 60 * 24);
    if (prom_intensidad < 3 && prom_intensidad > 0) {
      nivel_dominante = 1;
    } else if (prom_intensidad > 2 && prom_intensidad < 5) {
      nivel_dominante = 2;
    } else if (prom_intensidad > 4 && prom_intensidad < 7) {
      nivel_dominante = 3;
    } else if (prom_intensidad > 6 && prom_intensidad < 9) {
      nivel_dominante = 4;
    } else {
      nivel_dominante = 5;
    }

    // Almacenar la información
    console.log("Insertando historial");
    const idHistorial = await createHistorial({
      idPaciente,
      fecha_inicio,
      fecha_fin,
      emocion_predom,
      prom_intensidad,
      total_dias,
      nivel_dominante,
      comentario,
    });
    console.log("Historial creado con id:", idHistorial);
    return res.status(201).json({ message: "Historial creado con éxito" });
  } catch (err) {
    console.log("Error al registrar historial", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtención de información de los historiales dependiendo del usuario paciente
export const obtenerInfo = async (req, res) => {
  const { idPaciente } = req.params;
  try {
    const historial = await getHistoriaByPaciente(idPaciente);
    if (!historial)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtención de información de los pacientes que cuenten con una cita con un profesional
export const obteneHistorialPac = async (req, res) => {
  const { idProfesional } = req.params;
  try {
    const historial = await getHistorial(idProfesional);
    if (!historial)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para obtener síntomas de un paciente
export const obtenerSintoma = async (req, res) => {
  const { idPaciente } = req.params;
  try {
    const sintoma = await getSintomasByPaciente(idPaciente);
    if (!sintoma)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(sintoma);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
