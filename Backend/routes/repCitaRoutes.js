import express from "express";
import { infoCitaPorProfesional, infoCitaAdm, exportarExcel} from "../controllers/repCitaController.js";

const router = express.Router();

router.get("/info-citas", infoCitaPorProfesional);
router.get("/info-citas-profesionales", infoCitaAdm);

router.post("/excel", exportarExcel);


export default router;