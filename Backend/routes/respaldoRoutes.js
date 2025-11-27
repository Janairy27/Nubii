import express from "express";
import {
  obtenerRespaldos,
  creacionRespaldo,
  restauracion,
} from "../controllers/respaldoController.js";

const router = express.Router();

router.get("/obtener-respaldos", obtenerRespaldos);
router.post("/crear-respaldo", creacionRespaldo);
router.post("/restaurar", restauracion);

export default router;
