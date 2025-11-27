import express from "express";
import {
  registrarRecomendacion,
  modificarRecomendacionProf,
  getRecomendacionesProf,
  modificarRecomendacionPac,
  getRecomendacionesPac,
} from "../controllers/recomendacionController.js";

const router = express.Router();

router.post("/registro-recomendacion", registrarRecomendacion);
router.put(
  "/modificar-recomendacion/:idRecomendacion",
  modificarRecomendacionProf
);

router.put(
  "/calificar-recomendacion/:idRecomendacion",
  modificarRecomendacionPac
);

router.get(
  "/obtener-recomendaciones/:idProfesional/:publico",
  getRecomendacionesProf
);

router.get("/obtener-recomendacionesPac/:idPaciente", getRecomendacionesPac);

export default router;
