import express from "express";
import {
  enviarMensaje,
  obtenerChat,
  getPacientesPorProfesional,
  marcarMensajesLeidos,
  obtenerMensajesNoLeidos,
  obtenerMensajesNoLeidosPac,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/enviar", enviarMensaje);
router.get("/no-leidos/:idProfesional", obtenerMensajesNoLeidos);
router.get("/no-leidosPac/:idPaciente", obtenerMensajesNoLeidosPac);
router.get("/pacientes/:idProfesional", getPacientesPorProfesional);

router.get("/:idPaciente/:idProfesional", obtenerChat);

router.put("/leido/:idPaciente/:idProfesional", marcarMensajesLeidos);

export default router;
