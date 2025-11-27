import express from "express";
import {
  infoCitasAgAdmin,
  infoAgendadosProf,
  exportarExcel,
} from "../controllers/repProfAgendadosController.js";

const router = express.Router();

router.get("/info-profesionales-agendados", infoCitasAgAdmin);
router.get("/info-agendas", infoAgendadosProf);

router.post("/excel", exportarExcel);

export default router;
