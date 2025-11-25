import express from "express";
import { infoSeguimientoPaciente, infoSeguimientoPorProfesional, exportarPDF } from "../controllers/repSeguimientoController.js";

const router = express.Router();

router.get("/info-seguimientoPac", infoSeguimientoPaciente);
router.get("/info-seguimiento-pacientes", infoSeguimientoPorProfesional);

router.post("/pdf", exportarPDF);


export default router;