import express from "express";
import {
  registrarResultado,
  ActualizarResultadoT,
  EliminarResultadoT,
  getResultadoByFilterProf,
  getResultadoByFilterPac,
  getAllResultadosTestByFilterAdmin,
} from "../controllers/resultadoController.js";

const router = express.Router();

router.post("/registro-resultado", registrarResultado);
router.put("/actualizar-resultado/:idResultadoTest", ActualizarResultadoT);
router.delete("/eliminar-resultado/:idResultadoTest", EliminarResultadoT);

router.get("/by-filter", getResultadoByFilterProf);
router.get("/by-filterPac", getResultadoByFilterPac);

router.get("/all-by-filter", getAllResultadosTestByFilterAdmin);

export default router;
