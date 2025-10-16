import express from "express";
import {
    registrarSintoma, ActualizarSintoma, EliminarSintoma,
    getSintomasByidPaciente, getSintomasByAttribute, getSintomasByAttributePaciente
} from "../controllers/sintomaController.js";

const router = express.Router();

router.post("/registrar-sintoma", registrarSintoma);
router.put("/actualizar-sintoma/:idSintoma", ActualizarSintoma);
router.delete("/eliminar-sintoma/:idSintoma", EliminarSintoma);
router.get("/by-idPaciente/:idPaciente", getSintomasByidPaciente);
// ruta de busqueda especifica para pacientes
router.get("/by-attribute/:atributo/:valor/:idPaciente", getSintomasByAttributePaciente);
// ruta que hace busqueda en las vistas admin y profesional


export default router;