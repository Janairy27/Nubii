import express from "express";
import upload from "../middleware/upload.js";
import {
    registrarActividad, ActualizarActividad, EliminarActividad,
    getActividadesByAttributeProfesional, getActividadesByProfesional, getActividadesByFilter,
    getActividadByidActividad, getActividadesByFilterAdmin
} from "../controllers/actividadController.js";

const router = express.Router();

router.post("/registro-actividad", upload.single("multimedia"), registrarActividad);
router.put("/actualizar-actividad/:idActividad",upload.single("multimedia"), ActualizarActividad);
router.delete("/eliminar-actividad/:idActividad", EliminarActividad);
router.get("/by-idProfesional/:idProfesional/:publico", getActividadesByProfesional);
router.get("/actividad/:idActividad", getActividadByidActividad);
// ruta de busqueda en vista de profesionales
router.get("/by-attribute/:atributo/:valor/:idProfesional/:publico", getActividadesByAttributeProfesional);
// ruta de busqueda en vista de pacientes
router.get("/by-filter/", getActividadesByFilter);
// ruta de busqueda en vista de administradores
router.get("/by-filterUser/", getActividadesByFilterAdmin);


export default router;