import express from "express";
import { infoDiagnosticoPaciente, infoDiagnosticoPorProfesional, exportarPDF } from "../controllers/repDiagnosticoController.js";

const router = express.Router();

router.get("/info-DiagnosticoPac", infoDiagnosticoPaciente);
router.get("/info-diagnostico-profesional", infoDiagnosticoPorProfesional);

router.post("/pdf", exportarPDF);


export default router;