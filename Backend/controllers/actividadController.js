import { createActividad, getInfoPacienteyProfesional,
    updateActividad, deleteActividad, findActividadById, findActividadByActividad, findActividadByAttributeProfesional,
    getActividadesByProfesionalDesc, getActividadesByAttributeUsuarios, getActividadById 
 } from "../models/actividadModel.js";
import {sendNotificacion} from "../services/notificacionActividad.js";

const SOLO_LETRAS_ExpReg = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
const PARRAFOS_GRANDES_ExpReg = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.,\n]+$/;


// Validar campos de texto
function validar(nombreAct, descripcionAct, objetivo){
    const errores = [];
    if(!nombreAct || !SOLO_LETRAS_ExpReg.test(nombreAct)){
        errores.push("El nombre de la actividad debe ser textual");
    }

    if(!descripcionAct || !PARRAFOS_GRANDES_ExpReg.test(descripcionAct)){
        errores.push("La descripción deberá ser textual");
    }

    if(!objetivo || !PARRAFOS_GRANDES_ExpReg.test(objetivo)){
        errores.push("El objetivo de la actividad debe ser textual");
    }

    return errores;
};

// Registro de actividades
export const registrarActividad = async(req, res) => {
    console.log("Información de actividad obtenida:", req.body);

    const{
        nombreAct, descripcionAct, objetivo, publico, fechaPublicado
    } = req.body;

    const tipoAct = Number(req.body.tipoAct);
    const duracion_minutos = Number(req.body.duracion_minutos);
    const dificultad = Number(req.body.dificultad);
    const idProfesional = Number(req.body.idProfesional);
    const multimedia = req.file ? req.file.filename : null;

    try{
        // Validación de campos nulos
        if(!nombreAct || !descripcionAct || !tipoAct || !duracion_minutos || !dificultad || !objetivo){
            return res.status(400).json({message: "Faltan campos por completar"});
        }

        // Validación del formato de texto
        const errores = validar(nombreAct, descripcionAct, objetivo);
        if(errores.length > 0){
            console.log("Errores de validacion:", errores);
            return res.status(400).json({message: "Favor de cumplir con el formato solicitado", errores});
        }

        try{
            // Almacenamiento de infromación de la actividad
            console.log("Insertando actividad");
            const idActividad = await createActividad({
                nombreAct, descripcionAct, tipoAct, duracion_minutos, dificultad, objetivo, multimedia, publico, idProfesional, fechaPublicado
            });
            console.log("Actividad creada con id:", idActividad);

            // validar el estado en el que el profesional dejo la actividad
            // 1 = no publicar y mantener borrador, 2 = publicar
            if(publico === 2){
                // Obtener todos los pacientes que se encuentren activos para notificar de la actividad
                const pacientes = await getInfoPacienteyProfesional(idActividad);
                console.log("Antes de enviar correo a los pacientes");
                
                // Envio de correo a cada uno de los pacientes
                for(const paciente of pacientes){  
                    const {emailPaciente, nombrePaciente, nombreProfesional} = paciente; 
                    await sendNotificacion(emailPaciente, nombrePaciente, nombreProfesional);
                }
                console.log("Después de enviar correo de notificacion");
            }
            res.status(201).json({message: "Actividad creada con éxito"});
        }catch(err){
            console.log("Error al crear actividad", err.message);
            res.status(500).json({error: err.message});
            console.log("Error completo:", err);
        }

    }catch(err){
        console.log("Error al registrar actividad", err);
        res.status(500).json({error: "Error interno del servidor"});
    }    
};

// Función para actualizar actividades
export const ActualizarActividad = async(req, res) => {
    const {idActividad} = req.params;
    console.log(`ID de la actividad ${idActividad}`);

    const{
        nombreAct, descripcionAct, objetivo,
    } = req.body;

    const tipoAct = Number(req.body.tipoAct);
    const duracion_minutos = Number(req.body.duracion_minutos);
    const dificultad = Number(req.body.dificultad);
    const publico = Number(req.body.publico);

     // Obtener la actividad actual
    const actividadActual = await getActividadById(idActividad);
    if (!actividadActual) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    // Si no se sube nueva imagen, conservar la anterior
    const multimedia = req.file
      ? req.file.filename 
      : actividadActual.multimedia;
    console.log("Información obtenida de la actividad:", req.body);

    try{
        // Validación de campos textuales
        const errores = validar(nombreAct, descripcionAct, objetivo);
        if(errores.length > 0){
            return res.status(400).json({message: "Errores de validación", errores});
        }

        console.log(`Actualizando actividad con id ${idActividad}`);
        const Actividad = await updateActividad(idActividad, {nombreAct, descripcionAct, tipoAct, duracion_minutos, 
            dificultad, objetivo, multimedia, publico});
        console.log("Resultados obtenidos despues de actualizar:", Actividad);

        if(!Actividad){
            return res.status(404).json({message: "La actividad no fue actualizada"});
        }

        try{
            console.log(`Estado de publicidad: ${publico}`);
            if(publico === 2){
                // Obtener todos los pacientes que se encuentren activos para notificar de la actividad
                const pacientes = await getInfoPacienteyProfesional(Actividad);
                console.log("Antes de enviar correo a los pacientes");
                
                // Envio de correo a cada uno de los pacientes
                for(const paciente of pacientes){  
                    const {emailPaciente, nombrePaciente, nombreProfesional} = paciente; 
                    await sendNotificacion(emailPaciente, nombrePaciente, nombreProfesional);
                }
                console.log("Después de enviar correo de notificacion");
            }
        }catch(err){
            console.log("Error al enviar correo electronico");
            return res.status(500).json({error: err.message});
        }

        res.json({message: "Actividad actualizada exitosamente"});
            
    }catch(err){
        console.log("Errores al actualizar actividad:", err);
        res.status(500).json({error: err.message});
    }
};

// Función para eliminar actividad
export const EliminarActividad = async(req, res) => {
    const {idActividad} = req.params;
    console.log(`id de la actividad recibido: ${idActividad}`);
    try{
        await deleteActividad(idActividad);
        res.json({message: "Actividad eliminada con éxito"});
    }catch(err){
        console.log("Error al eliminar actividad:", err);
        res.status(500).json({error: err.message});
    }
};

// Función que permite listar todas las actividades creadas de los profesionales
export const getActividadesByProfesional = async(req, res) => {
    const {idProfesional, publico} = req.params;
    console.log(`Id del profesional obtenido para las actividades ${idProfesional} y publico ${publico}`);

    try{
        const actividad = await getActividadesByProfesionalDesc(idProfesional, publico);
        console.log("Actividades obtenidos");
        if(!actividad){
            return res.status(404).json({message: "Actividad no encontrada"});
        }

        res.json(actividad);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Obtener unicamente el nombre y fecha de la actividad 
export const getActividadByidActividad = async(req, res) => {
    const{idActividad} = req.params;
    console.log("Id de la actividad:", idActividad);
    try{
        const actividad = await findActividadByActividad(idActividad);
        if(!actividad) return res.status(404).json({message: "Actividad no encontrada"});
        res.json(actividad);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Función para hacer búsquedas en la vista de profesionales
export const getActividadesByAttributeProfesional = async(req, res) => {
    const {atributo, valor, idProfesional, publico} = req.params;
    try{
        const atributosPermitidos = {
            nombreAct: 'nombreAct',
            descripcionAct: 'descripcionAct',
            objetivo: 'objetivo'
        };

        const consulta = atributosPermitidos[atributo];

        if(!consulta){
            return res.status(400).json({message: "Atributo no válido"});
        }

        const resultado = await findActividadByAttributeProfesional(consulta, valor, idProfesional, publico);
        res.json(resultado);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Función para hacer la búsqueda de actividades en pacientes 
export const getActividadesByFilter = async(req, res) => {
    try{
        const{idPaciente, nombreProfesional, nombreAct, tipoAct, duracion_minutos, dificultad} = req.query;
        console.log("Parametros recibidos:", req.query);
        
        // conversion de parametros de texto a numericos
        const filtros = {
            nombreProfesional: nombreProfesional || undefined,
            nombreAct: nombreAct || undefined, 
            tipoAct: tipoAct ? parseInt(tipoAct): undefined,
            duracion_minutos: duracion_minutos ? parseInt(duracion_minutos): undefined,
            dificultad: dificultad ? parseInt(dificultad): undefined
        };
        
        const resultado = await getActividadesByAttributeUsuarios(filtros, parseInt(idPaciente));
        res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de actividades filtradas:", err);
        res.status(500).json({error: err.message});
    }
};

// Función para hacer la búsqueda de actividades en administradores 
export const getActividadesByFilterAdmin = async(req, res) => {
    try{
        const{nombreProfesional, nombreAct, tipoAct, duracion_minutos, dificultad} = req.query;
        console.log("Parametros recibidos:", req.query);
        
        // conversion de parametros de texto a numericos
        const filtros = {
            nombreProfesional: nombreProfesional || undefined,
            nombreAct: nombreAct || undefined, 
            tipoAct: tipoAct ? parseInt(tipoAct): undefined,
            duracion_minutos: duracion_minutos ? parseInt(duracion_minutos): undefined,
            dificultad: dificultad ? parseInt(dificultad): undefined
        };
        
        const resultado = await getActividadesByAttributeUsuarios(filtros);
        res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de actividades filtradas:", err);
        res.status(500).json({error: err.message});
    }
};