import {
  findProfesionalByUsuario,
  FindProfesionales,
} from "../models/profesionalModelo.js";

// Obtener profesional a través del idUsuario
export const getProfesionalByidUsuario = async (req, res) => {
  const { idUsuario } = req.params;
  console.log(`Id del usuario ${idUsuario}`);
  try {
    //
    const user = await findProfesionalByUsuario(idUsuario);
    if (!user)
      return res.status(404).json({ message: "Profesional no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para mostrar todos los profesionales
export const getProfesionales = async (req, res) => {
  const { especialidad } = req.params;
  try {
    const user = await FindProfesionales(especialidad);
    if (!user)
      return res.status(404).json({ message: "Sin registro de profesionales" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
