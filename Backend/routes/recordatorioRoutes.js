import express from "express";
import {
    registrarRecordatorio, ActualizarRecordatorio, EliminarRecordatorio,
    getRecordatoriosByFilter,
} from "../controllers/recordatorioController.js";

const router = express.Router();

router.post("/registro-recordatorio", registrarRecordatorio);
router.put("/actualizar-recordatorio/:idRecordatorio", ActualizarRecordatorio);
router.delete("/eliminar-recordatorio/:idRecordatorio", EliminarRecordatorio);

router.get("/by-filter", getRecordatoriosByFilter);

export default router;