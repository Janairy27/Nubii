import express from "express";
import {
    registrarResultado, ActualizarResultadoT, EliminarResultadoT,
    getResultadoByFilterProf, getResultadoByFilterPac
} from "../controllers/resultadoController.js";

const router = express.Router();

router.post("/registro-resultado", registrarResultado);
router.put("/actualizar-resultado/:idResultadoTest", ActualizarResultadoT);
router.delete("/eliminar-resultado/:idResultadoTest", EliminarResultadoT);

router.get("/by-filter", getResultadoByFilterProf);
router.get("/by-filterPac", getResultadoByFilterPac);

export default router;