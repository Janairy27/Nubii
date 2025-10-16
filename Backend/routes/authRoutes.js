import express from "express";
import {
    login, logout, register, ActualizarUsuario, EliminarUsuario, googleAuth,
    getUserByEmail,  forgotPassword, resetPassword, getUserByAttribute, getFullUserById,
    getUsuariosByFilter
} from "../controllers/authController.js";
import { getPacienteByidUsuario } from "../controllers/pacienteController.js";
import { getProfesionalByidUsuario } from "../controllers/profesionalController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/protected", authMiddleware, (req, res) => {
    res.json({message: `Hola usuario ${req.user.email}`});
});
router.post('/google', googleAuth);
router.get("/by-email/:email", getUserByEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",resetPassword);

router.put("/update/:id", ActualizarUsuario);
router.delete("/delete/:id", EliminarUsuario);

router.get("/by-attribute/:atributo/:valor", getUserByAttribute);
router.get("/by-id/:id", getFullUserById);
router.get("/by-filter", getUsuariosByFilter);

// Ruta para obtener informacion personal del paciente 
router.get("/paciente/:idUsuario", getPacienteByidUsuario);

// Ruta para obtener informacion personal del profesional
router.get("/profesional/:idUsuario", getProfesionalByidUsuario);

export default router;

