import express from "express";
import {
  registrarNotificacion,
  listarNotificaciones,
  borrarNotificacion,
} from "../controllers/notificacionController.js";

import {
  marcarLeido,
  marcarTodasLeidas,
} from "../controllers/notificacionController.js";

const router = express.Router();

router.post("/", registrarNotificacion); 
router.get("/:idUsuario", listarNotificaciones); 

router.delete("/:idNotificacion", borrarNotificacion); 

router.put("/marcar-leido/:idNotificacion", marcarLeido);

router.put("/marcar-todas/:idUsuario", marcarTodasLeidas);

export default router;
