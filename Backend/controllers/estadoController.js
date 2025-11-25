import { db } from "../config/db.js";
import {
    createEstado, obtenerEstadoById, obtenerEstadoFinal
} from "../models/estadosModel.js";

import { transaccionvalida } from "../utils/validaciones.js";

// Registro de estado de citas
export const registrarEstado = async(req, res) => {
    console.log("Información de la cita obtenida:", req.params);

    const {idCita, estado} = req.params;
    const nuevoEstado = parseInt(estado, 10);
    const rol = parseInt(req.user.role, 10);

    let estado_anterior_renglon = await obtenerEstadoFinal(idCita);
    const estado_anterior =estado_anterior_renglon?.estado ?? null; 
    console.log("estado anterior:", estado_anterior);

    try{
        if(!transaccionvalida(estado_anterior, nuevoEstado, rol)){
            return res.status(400).json({ mensaje: 'Transición de estado no válida' });
        }

        console.log("Cambiando estado de la cita");
        const idEstado = await createEstado(idCita, estado);
        console.log("Cambio de cita creado con id:", idEstado);
    
        
        return res.status(201).json({message: "Estado de cita almacenado"});
        
    }catch(err){
        console.log("Error al registrar cita", err);
        return res.status(500).json({error: "Error interno del servidor"});
    }
};

//Función para obtener el último estado de una cita
export const obtenerUltimoEstado = async(req, res) => {
    const {idCita} = req.params;
    const estado = await obtenerEstadoFinal(idCita);
    if(estado){
        res.json({estado: estado.estado});
    }else{
        res.status(404).json({message: "Sin estado registrado"});
    }
};