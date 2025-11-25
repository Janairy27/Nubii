import {
    createCita, updateCita, updateCitaProf, deleteCita,
    getCitasByAtrributePac, getCitasByAtrributeProf, getInfoCita,
    infoCita, infoCitaProf, obtenerPacientesCita, getCitasByAtrributeAdmin
} from "../models/citaModel.js";

import { createEstado } from "../models/estadosModel.js";
import { crearNotificacion } from "../models/notificacionModel.js";

import { validarParrafos } from "../utils/validaciones.js";
import { notificacionInterna } from "../services/recordatorio.js";
import { getUsuarioByProfesional } from "../models/profesionalModelo.js";
import { getUsuarioByPaciente } from "../models/pacienteModel.js";

// Registro de citas
export const registrarCita = async (req, res) => {
  console.log("Información de la cita obtenida:", req.body);

  const fecha_cita = req.body.fecha_cita;
  const idProfesional = Number(req.body.idProfesional);
  const idPaciente = Number(req.body.idPaciente);
  const modalidad = Number(req.body.modalidad);
  const enviado = Number(req.body.enviado);

  try {
    // Validación de campos
    if (!idProfesional) return res.status(404).json({ message: "Profesional obligatorio, primero selecciona una especilidad y después selecciona al profesional" });
    if (!fecha_cita) return res.status(404).json({ message: "Fecha de la cita obligatoria" });
    if (!modalidad) return res.status(404).json({ message: "Modalidad de cita obligatoria" });
    if (!enviado) return res.status(404).json({ message: "Estado de la cita obligatorio" });

    // Asegurar que la fecha se interprete como local, no UTC
const fecha = new Date(fecha_cita);
const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
const fechaFinal = local.toISOString().slice(0, 19).replace('T', ' ');



    // Insertar la cita
    const idCita = await createCita(fechaFinal, { idPaciente, idProfesional, modalidad, enviado });
    console.log("Cita creada con id:", idCita);

    // Si el estado es pendiente (enviado === 2), registrar en tabla de estados
    if (enviado === 2) {
      const fecha_cambio = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await createEstado(idCita, 1, fecha_cambio);

      //  Notificación interna al profesional
    const idUsuario = await getUsuarioByProfesional(idProfesional); // obtenemos idUsuario
    if (idUsuario) {
      const mensaje = `Nueva solicitud de cita para el día ${fecha_cita}.`;

      // Crear registro en tabla Notificacion
      await crearNotificacion({
        idUsuario,
        titulo: "Nueva solicitud de cita",
        mensaje,
        tipo: "sistema",
      });

      // Enviar por socket
      await notificacionInterna(idUsuario, mensaje);
    } else {
      console.log("El profesional no tiene usuario asociado. No se envió notificación");
    }
    }

    

    res.status(201).json({ message: "Cita creada y notificación procesada" });
  } catch (err) {
    console.log("Error al registrar cita", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Función para actualizar citas para los pacientes
export const ActualizarCita = async(req, res) => {
    const {idCita} = req.params;
    console.log("ID de la cita:", idCita);

    const modalidad = Number(req.body.modalidad);
    const fecha_cita = (req.body.fecha_cita);
    const enviado = Number(req.body.enviado);
    const idProfesional = Number(req.body.idProfesional);
    const idPaciente = Number(req.body.idPaciente);
    console.log("Informacion obtenida de la cita :", req.body);

    try{
        if(!fecha_cita) return res.status(404).json({message: "Fecha de la cita obligatoria"});
        if(!modalidad) return res.status(404).json({message: "Modalidad de cita obligatoria"});
        if(!enviado) return res.status(404).json({message: "Estado de la cita obligatorio"});    
        const fecha = new Date(fecha_cita);
        const formateada = fecha.toISOString().slice(0,19).replace('T', ' ');

        console.log("Actualizando cita con id:", idCita);
        const Cita = await updateCita(idCita, formateada, { modalidad, enviado});
        console.log("Cita actualizada");
        if(!Cita){
            return res.status(404).json({message: "La cita no fue actualizada"});
        }

        if(enviado === 2){
            let fecha_cambio = new Date().toISOString().slice(0,19).replace('T', ' ');
            await createEstado(idCita, 1, fecha_cambio);
        
            const idUsuario = await getUsuarioByProfesional(idProfesional);
      if (idUsuario) {
        const mensaje = `El paciente ha actualizado su solicitud de cita para el día ${fecha_cita}.`;

        //  Crear registro en tabla Notificacion
        await crearNotificacion({
          idUsuario,
          titulo: "Actualización de cita",
          mensaje,
          tipo: "sistema",
        });

        await notificacionInterna(idUsuario, mensaje);
      } else {
        console.log(" El profesional no tiene usuario asociado. No se envió notificación");
      }
    }

        res.json({message: "Cita actualizada exitosamente"});
    }catch(err){
        console.log("Errores al actualizar cita:", err);
        res.status(500).json({error: err.message});
    }
};

// Función para actualizar citas en profesionales
export const ActualizarCitaprof = async (req, res) => {
  const { idCita } = req.params;
  console.log("🩵 ID de la cita:", idCita);

  const { enlace, comentario } = req.body;
  const duracion_horas = Number(req.body.duracion_horas);
  console.log(" Información obtenida de la cita:", req.body);

  try {
    // Obtener modalidad e información de paciente
    const infoCita = await getInfoCita(idCita);
    const modalidad = infoCita?.modalidad;
    const idPaciente = infoCita?.idPaciente;

    if (!duracion_horas)
      return res.status(404).json({ message: "La duración de la cita es obligatoria" });

    if (modalidad === 2 && !enlace)
      return res.status(404).json({ message: "El enlace de la cita es obligatorio" });

    const errores = validarParrafos(comentario);
    if (errores > 0)
      return res.status(400).json({
        message: "Favor de cumplir con el formato solicitado",
        errores,
      });

    console.log(" Actualizando cita con id:", idCita);
    const cita = await updateCitaProf(idCita, { duracion_horas, enlace, comentario });
    if (!cita) return res.status(404).json({ message: "La cita no fue actualizada" });

    // Notificación interna al paciente
    const idUsuario = await getUsuarioByPaciente(idPaciente);
    if (idUsuario) {
      const mensaje =
        modalidad === 2
          ? `Tu cita en línea ha sido actualizada. Enlace: ${enlace}`
          : `Tu cita ha sido actualizada por el profesional.`;
      await crearNotificacion({
        idUsuario,
        titulo: "Cita actualizada",
        mensaje,
        tipo: "sistema",
      });
      await notificacionInterna(idUsuario, mensaje);
    } else {
      console.log(" El paciente no tiene usuario asociado. No se envió notificación");
    }

    res.json({ message: "Cita actualizada y notificación enviada" });
  } catch (err) {
    console.error("Error al actualizar cita:", err);
    res.status(500).json({ error: err.message });
  }
};

// Función para eliminar evidencia
export const EliminarCita = async(req, res) => {
    const {idCita} = req.params;
    console.log("ID de la cita recibido:", idCita);
    try{
        await deleteCita(idCita);
        res.json({message: "Cita eliminada con éxito"});
    }catch(err){
        console.log("Error al eliminar cita:", err);
        res.status(500).json({error: err.message});
    }
};


// función para hacer busqueda de las citas de forma dinamica para los profesionales
export const getCitasByFilterProf = async(req, res) => {
    try{
        const{idProfesional, nombrePaciente, fecha_cita, modalidad, enviado, comentario} = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            nombrePaciente: nombrePaciente || undefined,
            fecha_cita: fecha_cita || undefined,
            modalidad: modalidad || undefined,
            comentario: comentario || undefined
        };

        const resultado = await getCitasByAtrributeProf(filtros, parseInt(idProfesional));
        return res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de citas filtradas:", err);
        return res.status(500).json({error: err.message});
    }
};

// función para hacer búsqueda de los resultados almacenados de forma dinamica para los pacientes
export const getCitasByFilterPac = async(req, res) => {
    try{
        const{idPaciente, nombreProfesional, fecha_cita, modalidad, comentario, enviado} = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            nombreProfesional: nombreProfesional || undefined,
            fecha_cita: fecha_cita || undefined,
            modalidad: modalidad ? parseInt(modalidad): undefined,
            comentario: comentario || undefined,
            enviado: enviado ? parseInt(enviado): undefined,
        };

        const resultado = await getCitasByAtrributePac(filtros, parseInt(idPaciente));
        res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de citas filtradas:", err);
        res.status(500).json({error: err.message});
    }
};

// Función para obtener eventos de citas para el calendario del paciente

export const obtenerEventos = async(req, res) => {
    try{
        const {idPaciente} = req.params;
        const citas = await infoCita(idPaciente);
        const eventos = citas.map(cita => ({
            idCita: cita.idCita,
            title: `Cita con el profesional ${cita.nombreProfesional}`,
            date: cita.fecha_cita,
            type: 'appointment'
        }));

        res.json(eventos);
    }catch(err){
        console.log("Error al obtener eventos de citas", err);
        res.status(500).json({error: "Error al obtener citas", err});
    }
};

// Función para obtener eventos de citas para el calendario del profesional
export const obtenerEventosProf = async(req, res) => {
    try{
        const {idProfesional} = req.params;
        const citas = await infoCitaProf(idProfesional);
        const eventos = citas.map(cita => ({
            idCita: cita.idCita,
            title: `Cita con el paciente ${cita.nombrePaciente}`,
            date: cita.fecha_cita,
        }));

        res.json(eventos);
    }catch(err){
        console.log("Error al obtener eventos de citas", err);
        res.status(500).json({error: "Error al obtener citas", err});
    }
};

// Función que obtiene todos aquellos pacientes que han agendado citas
export const getCitasPac = async(req, res) => {
    const {idProfesional} = req.params;
    try{
        const cita = await obtenerPacientesCita(idProfesional);
        if(!cita) return res.status(404).json({message: "Usuario no encontrado"});
        res.json(cita);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};


// Función para hacer búsqueda de las citas de forma dinámica para el administrador
export const getCitasByFilterAdmin = async(req, res) => {
    try{
        const{
            nombrePaciente, 
            nombreProfesional, 
            fecha_cita, 
            modalidad, 
            comentario, 
            enviado
        } = req.query;

        console.log("Parámetros de filtro recibidos para Admin:", req.query);
        const filtros = {
            nombrePaciente: nombrePaciente || undefined,
            nombreProfesional: nombreProfesional || undefined,
            fecha_cita: fecha_cita || undefined,
            modalidad: modalidad ? parseInt(modalidad) : undefined, 
            comentario: comentario || undefined,
            enviado: enviado ? parseInt(enviado) : undefined,
        };
        const resultado = await getCitasByAtrributeAdmin(filtros);
        return res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de citas filtradas para administrador:", err);
        return res.status(500).json({error: err.message});
    }
};