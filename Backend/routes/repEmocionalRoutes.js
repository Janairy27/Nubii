import express from "express";
import { infoEmocionalPaciente, infoEmocionalPorProfesional, exportarExcel, exportarPDF } from "../controllers/repEmocionalController.js";

const router = express.Router();

router.get("/info-emocionalPac", infoEmocionalPaciente);
router.get("/info-emocional-pacientes", infoEmocionalPorProfesional);

router.post("/excel", exportarExcel);
router.post("/pdf", exportarPDF);


export default router;