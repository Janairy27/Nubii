import express from "express";
import {
    registrarEvidencia, ActualizarEvidencia, EliminarEvidencia,
    getEvidenciasByFilter, getEvidenciasByPaciente
} from "../controllers/evidenciaController.js";

const router = express.Router();

router.post("/registro-evidencia", registrarEvidencia);
router.put("/actualizar-evidencia/:idEvidencia", ActualizarEvidencia);
router.delete("/eliminar-evidencia/:idEvidencia", EliminarEvidencia);
router.get("/by-idPaciente/:idPaciente", getEvidenciasByPaciente);
router.get("/by-filter", getEvidenciasByFilter);


export default router;