import {
    createRecordatorio,marcadoEnviado, notificacionInterna, obtenerPendientes,
    updateRecordatorio, deleteRecordatorio,
    getRecordatorioByAttribute,
} from "../models/recordatorioModel.js";
//import {Ejecutarse} from "../services/frecuencia.js";
import { RecordatorioEmail } from "../services/recordatorio.js";
import { validarRecordatorio } from "../utils/validaciones.js";

// Registro de recordatorios
export const registrarRecordatorio = async(req, res) => {
    console.log("Información de recordatorios obtenida:", req.body);

    const{mensaje, hora, tipo_recordatorio} = req.body;
    const frecuencia = Number(req.body.frecuencia);
    const idUsuario = Number(req.body.idUsuario);
    const notificacion = Number(req.body.notificacion);

    try{
        // Validar campos nulos
        if(!frecuencia)  return res.status(400).json({message: "La frecuencia es obligatoria"});
        if(!tipo_recordatorio)  return res.status(400).json({message: "El tipo de recordatorio es obligatorio"});
        if(!notificacion)  return res.status(400).json({message: "Tipo de notificación obligatorio"});
        
        // Validar tipos de dato
        let errores = validarRecordatorio(mensaje, hora);
        if(errores.length > 0){
            console.log("Errores de validación:", errores);
            return res.status(400).json({message: "Favor de cumplir con el formato", errores});
        }

        try{
            console.log("Insertando recordatorio");
            const idRecordatorio = await createRecordatorio({
                mensaje, hora, frecuencia, tipo_recordatorio, idUsuario, notificacion
            });
            console.log("Recordatorio creado con id:", idRecordatorio);

            res.status(201).json({message: "Recordatorio creado con éxito"});
        }catch(err){
            console.log("Error al crear recordatorio", err.message);
            res.status(500).json({error: err.message});
            console.log("Error completo:", err);
        }
    }catch(err){
        console.log("Error al registrar recordatorio", err);
        res.status(500).json({error: "Error interno"});
    }
};

// Función para actualizar recordatorio
export const ActualizarRecordatorio = async(req, res) =>{
    const {idRecordatorio} = req.params;
    console.log("ID del recordatorio:", idRecordatorio);

    const{mensaje, hora, tipo_recordatorio} = req.body;
    const frecuencia = Number(req.body.frecuencia);
    const notificacion = Number(req.body.notificacion);
    const culminado = Number(req.body.culminado);

    try{
        console.log("Actualizando recordatorio");
        const Recordatorio = await updateRecordatorio(idRecordatorio, {
            mensaje, hora, frecuencia, tipo_recordatorio, culminado, notificacion
        });
        console.log("Recordatorio actualizado");
        if(!Recordatorio) return res.status(404).json({message: "El recordatorio no fue actualizado"});

        res.status(201).json({message: "Recordatorio creado con éxito"});
        
    }catch(err){
        console.log("Error al actualizar recordatorio", err);
        res.status(500).json({error: err.message});
    }

};

// Función para eliminar recordatorio
export const EliminarRecordatorio = async(req, res) => {
    const {idRecordatorio} = req.params;
    console.log("ID del recordatorio recibido:", idRecordatorio);
    try{
        await deleteRecordatorio(idRecordatorio);
        res.json({message: "Recordatorio eliminado con éxito"});
    }catch(err){
        console.log("Error al eliminar recordatorio:", err);
        res.status(500).json({error: err.message});
    }
};



// Validación del tipo de notificacion
export const procesarRecordatorios = async(req, res) => {
    //console.log("ID del recordatorio:", req.body);
    const recordatorios = await obtenerPendientes();

    for(const rec of recordatorios){
        try{
            if(!Ejecutarse(rec.frecuencia, rec.fechaEnvio)) continue;

            if(rec.notificacion === 1){
                // Hacer el envio por correo electronico
                await RecordatorioEmail(rec.email, rec.nombreUsuario, rec.mensaje, rec.tipo_recordatorio);
            }else if(rec.notificacion === 2){
                // Notificación interna
                await notificacionInterna(rec.idUsuario, rec.mensaje);
            }
            await marcadoEnviado(rec.idRecordatorio); 
        }catch(err){
            console.log(`Error procesando recordatorios ${rec.idRecordatorio}`, err);
        }
    }
};


// Función para realizar la busqueda de recordatorios
export const getRecordatoriosByFilter = async(req, res) => {
    try{
        const{idUsuario, mensaje, hora, frecuencia, tipo_recordatorio} = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            mensaje: mensaje || undefined,
            hora: hora || undefined,
            frecuencia: frecuencia ? parseInt(frecuencia): undefined,
            tipo_recordatorio: tipo_recordatorio || undefined
        };

        const resultado = await getRecordatorioByAttribute(filtros, parseInt(idUsuario));
        res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de Recordatorios filtrados:", err);
        res.status(500).json({error: err.message});
    }
};