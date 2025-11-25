import express from "express";
import {
  registrarNotificacion,
  listarNotificaciones,
  borrarNotificacion
} from "../controllers/notificacionController.js";

import { marcarLeido, marcarTodasLeidas } from "../controllers/notificacionController.js";

const router = express.Router();

router.post("/", registrarNotificacion); // Crear nueva
router.get("/:idUsuario", listarNotificaciones); // Ver notificaciones por usuario

router.delete("/:idNotificacion", borrarNotificacion); // Eliminar

// Endpoint para marcar notificación como leída
router.put("/marcar-leido/:idNotificacion", marcarLeido);

router.put("/marcar-todas/:idUsuario", marcarTodasLeidas);


export default router;
