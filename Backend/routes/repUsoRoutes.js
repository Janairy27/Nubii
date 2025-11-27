import express from "express";
import { infoUso } from "../controllers/repUsoController.js";
import { exportarPDF } from "../controllers/repUsoController.js";

const router = express.Router();

router.get("/info-uso", infoUso);

router.post("/pdf", exportarPDF);

export default router;
