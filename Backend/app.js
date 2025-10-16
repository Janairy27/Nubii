import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import sintomaRoutes from "./routes/sintomaRoutes.js";
import actividadRoutes from "./routes/actividadRoutes.js";
import evidenciaRoutes from "./routes/evidenciaRoutes.js";
import recordatorioRoutes from "./routes/recordatorioRoutes.js";


import { procesarRecordatorios } from "./controllers/recordatorioController.js";

dotenv.config();
const app = express();


// Definir __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sintomas", sintomaRoutes);
app.use("/api/actividades", actividadRoutes);
app.use("/api/evidencia", evidenciaRoutes);
app.use("/api/recordatorio", recordatorioRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);

});

const envio = 5 * 60 * 1000;
setInterval(async () => {
    console.log(`[🕒 ${new Date().toLocaleTimeString()}] Verificando recordatorios...`);
    try{
        await procesarRecordatorios();
    }catch(err){
        console.log("Error procesando recordatorios:", err);
    }
}, envio);


