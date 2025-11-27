import express from "express";
import {
  registrarCita,
  ActualizarCita,
  ActualizarCitaprof,
  EliminarCita,
  getCitasByFilterPac,
  getCitasByFilterProf,
  obtenerEventos,
  obtenerEventosProf,
  getCitasPac,
  getCitasByFilterAdmin,
} from "../controllers/citaController.js";

const router = express.Router();

router.post("/registro-cita", registrarCita);
router.put("/actualizar-cita/:idCita", ActualizarCita);
router.put("/actualizar-citaProf/:idCita", ActualizarCitaprof);
router.delete("/eliminar-cita/:idCita", EliminarCita);

router.get("/by-filter", getCitasByFilterProf);
router.get("/by-filterPac", getCitasByFilterPac);
router.get("/by-filterAdmin", getCitasByFilterAdmin);

router.get("/citas/:idPaciente", obtenerEventos);
router.get("/citasProf/:idProfesional", obtenerEventosProf);

router.get("/pacientes/:idProfesional", getCitasPac);

export default router;
