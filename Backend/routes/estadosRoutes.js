import express from "express";
import {
  registrarEstado,
  obtenerUltimoEstado,
} from "../controllers/estadoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/registro-estadoCita/:idCita/:estado",
  authMiddleware,
  registrarEstado
);
router.get("/ultimo-estado/:idCita", obtenerUltimoEstado);

export default router;
