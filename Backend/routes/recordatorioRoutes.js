import express from "express";
import {
  registrarRecordatorio,
  ActualizarRecordatorio,
  EliminarRecordatorio,
  getRecordatoriosByFilter,
} from "../controllers/recordatorioController.js";

const router = express.Router();

router.post("/registro-recordatorio", registrarRecordatorio);
router.put("/actualizar-recordatorio/:idRecordatorio", ActualizarRecordatorio);
router.delete("/eliminar-recordatorio/:idRecordatorio", EliminarRecordatorio);

router.get("/by-filter", getRecordatoriosByFilter);

router.get("/pendientes/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const recordatorios = await obtenerPendientes(idUsuario);
    res.json(recordatorios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
});

export default router;
