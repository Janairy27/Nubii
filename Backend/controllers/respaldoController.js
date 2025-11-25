import { crearRespaldo, restaurarBD, lista } from "../services/backup.js";

// Función para obtener todos los respaldos creados
export const obtenerRespaldos = async(req, res) => {
    try{
        const archivos = lista();
        res.json(archivos);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Función para crear el respaldo de la base de datos
export const creacionRespaldo = async(req, res) => {
    try{
        console.log("Creando respaldo");
        const nombreDocumento = await crearRespaldo();
        res.json({message: "Respaldo creado", nombreDocumento});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Función para restaurar la base de datos
export const restauracion = async(req, res) => {
    try{
        const {nombreDocumento} = req.body;
        console.log("nombre del respaldo a hacer:", nombreDocumento);
        await restaurarBD(nombreDocumento);
        res.json({message: "Restauración completa"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};
