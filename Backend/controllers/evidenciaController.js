import{
    createEvidencia, updateEvidencia, deleteEvidencia, getEvidenciaByPacienteDesc,
    getEvidenciasByAtrribute,
} from "../models/evidenciaModel.js";

const PARRAFOS_GRANDES_ExpReg = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.,\n]+$/;

// Función para validar unicamente el comentario en caso de existir
function validar(comentario_Evidencia){
    const errores = [];
    if(comentario_Evidencia && !PARRAFOS_GRANDES_ExpReg){
        errores.push("El comentario debe ser textual");
    }
    return errores;
}

// Registro de evidencias
export const registrarEvidencia = async(req, res) => {
    console.log("Información de la evidencia obtenida:", req.body);

    const{fecha_sugerida, comentario_Evidencia} = req.body;
    let fecha_realizada = req.body.fecha_realizada;
    const idPaciente = Number(req.body.idPaciente);
    const idActividad = Number(req.body.idActividad);
    const completada = Number(req.body.completada);
    const satisfaccion = Number(req.body.satisfaccion);

    try{
        // Validación de campos nulos
        if(!satisfaccion){
            return res.status(404).json({message: "Faltan campos por completar"});
        }

        // Validar formato de comentario
        const errores = validar(comentario_Evidencia);
        if(errores > 0){
            return res.status(400).json({message: "Favor de cumplir con el formato solicitado", errores});
        }

        try{
            if(!completada ){
                fecha_realizada = null;
            }
            // Almacenar la información
            console.log("Insertando evidencia");
            const idEvidencia = await createEvidencia({
                idPaciente, idActividad, fecha_sugerida, fecha_realizada, completada, satisfaccion, comentario_Evidencia
            });
            console.log("Evidencia creada con id:", idEvidencia);
            res.status(201).json({message: "Evidencia creada con éxito"});
        }catch(err){
            console.log("Error al crear evidencia", err.message);
            res.status(500).json({error: err.message});
        }
    }catch(err){
        console.log("Error al registrar evidencia", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

// Función para actualizar evidencias
export const ActualizarEvidencia = async(req, res) => {
    const {idEvidencia} = req.params;
    console.log("ID de la evidencia:", idEvidencia);

    const{comentario_Evidencia} = req.body;
    let fecha_realizada = req.body.fecha_realizada;
    const completada = Number(req.body.completada);
    const satisfaccion = Number(req.body.satisfaccion);
    console.log("Informacion obtenida de la evidencia:", req.body);

    try{
        const errores = validar(comentario_Evidencia);
        if(errores.length > 0){
            return res.status(400).json({message: "Errores de validación", errores});
        }

        if(completada === 1){
            fecha_realizada = null;
        }else{
            fecha_realizada = new Date().toISOString().split('T')[0];
        }
        
        console.log("Actualizando evidencia con id:", idEvidencia);
        const Evidencia = await updateEvidencia(idEvidencia, {fecha_realizada, completada, satisfaccion, comentario_Evidencia});
        console.log("Evidencia actualizada");
        if(!Evidencia){
            return res.status(404).json({message: "La evidencia no fue actualizada"});
        }

        res.json({message: "Evidencia actualizada exitosamente"});
    }catch(err){
        console.log("Errores al actualizar evidencia:", err);
        res.status(500).json({error: err.message});
    }
};

// Función para eliminar evidencia
export const EliminarEvidencia = async(req, res) => {
    const {idEvidencia} = req.params;
    console.log("ID de la evidencia recibido:", idEvidencia);
    try{
        await deleteEvidencia(idEvidencia);
        res.json({message: "Evidencia eliminada con éxito"});
    }catch(err){
        console.log("Error al eliminar evidencia:", err);
        res.status(500).json({error: err.message});
    }
};

// Función que lista las evidencias de los pacientes
export const getEvidenciasByPaciente = async(req, res) => {
    const {idPaciente} = req.params;
    console.log("ID del profesional obtenido:", idPaciente);

    try{
        const evidencia = await getEvidenciaByPacienteDesc(idPaciente);
        console.log("Evidencias obtenidas");
        if(!evidencia){
            return res.status(404).json({message: "Evidencia no encontrada"});
        }
        res.json(evidencia);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// función para hacer busqueda de evidencias de forma dinamica
export const getEvidenciasByFilter = async(req, res) => {
    try{
        const{nombreActividad, fecha_sugerida, fecha_realizada, completada, satisfaccion} = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            nombreActividad: nombreActividad || undefined,
            fecha_sugerida: fecha_sugerida || undefined,
            fecha_realizada: fecha_realizada || undefined,
            completada: completada ? parseInt(completada): undefined,
            satisfaccion: satisfaccion ? parseInt(satisfaccion): undefined
        };

        const resultado = await getEvidenciasByAtrribute(filtros);
        res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de evidencias filtradas:", err);
        res.status(500).json({error: err.message});
    }
};

