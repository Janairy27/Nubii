import express from "express";
import {
  registrarHistorial,
  obtenerInfo,
  obteneHistorialPac,
  obtenerSintoma,
} from "../controllers/historialController.js";

const router = express.Router();

router.post("/registro-historial", registrarHistorial);
router.get("/obtener-historial/:idPaciente", obtenerInfo);
// Ruta que sirve para los profesionales de la salud
router.get("/obtener-historialPac/:idProfesional", obteneHistorialPac);

router.get("/obtener-sintoma/:idPaciente", obtenerSintoma);

export default router;
