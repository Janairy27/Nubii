import { 
    createRecomendacion, modifyRecomendacion, modifyRecomendacionPaciente,
    getActividadById, obtenerRecomendaciones, obtenerRecomendacionesPac,
    getRecomendacionById, getPacienteByRecomendacion

} from "../models/recomendacionModel.js";
import { notificacionInterna } from "../services/recomendacion.js";
import { crearNotificacion } from "../models/notificacionModel.js";
import { getUsuarioByPaciente } from "../models/pacienteModel.js";
import { getUsuarioByProfesional } from "../models/profesionalModelo.js";

import { validarParrafos } from "../utils/validaciones.js";

// Registro de recomendación
export const registrarRecomendacion = async(req, res) => {
    console.log("Información obtenida:", req.body);

    const{actividad, descripcion} = req.body;
    const idPaciente = Number(req.body.idPaciente);
    const idProfesional = Number(req.body.idProfesional);
    const publico = Number(req.body.publico);
    
    try{
        // Validación de campos nulos
        if(!actividad) return res.status(404).json({message: "El nombre de la actividad es obligatoria"});
        if(!descripcion) return res.status(404).json({message: "La descripción es obligatoria"});
        if(!idPaciente) return res.status(404).json({message: "El nombre del paciente es obligatorio"});

        // Validar formato de comentario
        const errores = validarParrafos(descripcion);
        if(errores > 0){
            return res.status(400).json({message: "Favor de cumplir con el formato solicitado", errores});
        }

        // Almacenar la información
        console.log("Insertando actividad recomendada");
        const idRecomendacion = await createRecomendacion({
            idProfesional, idPaciente, actividad, descripcion, publico});
        console.log("Recomendación creada con id:", idRecomendacion);

        if (publico === 2) {
          //  Notificación interna al paciente
    const idUsuario = await getUsuarioByPaciente(idPaciente); // obtenemos idUsuario
    if (idUsuario) {
      const mensaje = `Nueva actividad  ${actividad}.`;
         //  Crear notificación interna automáticamente
            await crearNotificacion({
              idUsuario,
              titulo: "Nueva actividad personalizada  creada",
              mensaje: `Se ha registrado una actividad personalizada: "${mensaje}"`,
              tipo: "sistema",
            });
             // Enviar por socket
      await notificacionInterna(idUsuario, mensaje);
    } else {
      console.log("El profesional no tiene usuario asociado. No se envió notificación");
    }
}
        return  res.status(201).json({message: "Recomendación creada con éxito"});
     
    }catch(err){
        console.log("Error al registrar recomendación", err);
        return res.status(500).json({error: "Error interno del servidor"});
    }
};

// Función para modificar actividades por parte del profesional
export const modificarRecomendacionProf = async(req, res) => {
    const {idRecomendacion} = req.params;
    const {actividad, descripcion} = req.body;
    const publico = Number(req.body.publico);

    try{
        if(!actividad) return res.status(404).json({message: "El nombre de la actividad es obligatoria"});
        if(!descripcion) return res.status(404).json({message: "La descripción es obligatoria"});

        const errores = validarParrafos(descripcion);
        if(errores > 0){
            return res.status(400).json({message: "Favor de cumplir con el formato solicitado", errores});
        }

        const Recomendacion = await modifyRecomendacion(idRecomendacion, {actividad, descripcion, publico});
        if(!Recomendacion){
            return res.status(404).json({message: "La recomendación no fue actualizada"});
        }
         // Solo notificar al paciente si la actividad se publica y antes no estaba publicada
    if (publico === 2) {
      const idUsuario = await getUsuarioByPaciente(Recomendacion.idPaciente);
      if (idUsuario) {
        const mensaje = `La actividad "${actividad}" ha sido actualizada y publicada.`;
        await crearNotificacion({
          idUsuario,
          titulo: "Actividad personalizada actualizada",
          mensaje,
          tipo: "sistema",
        });
        await notificacionInterna(idUsuario, mensaje);
      }
    }
        res.json({message: "Recomendación actualizada exitosamente"});

    }catch(err){
        console.log("Errores al actualizar recomendación:", err);
        res.status(500).json({error: err.message});
    }
};

// Función para modificar actividades por parte del paciente
export const modificarRecomendacionPac = async (req, res) => {
  console.log("INICIO DE EJECUCIÓN DEL CONTROLADOR");
  const { idRecomendacion } = req.params;
  console.log("ID de las recoemndaciones:", idRecomendacion);

  const mejoramiento = Number(req.body.mejoramiento);
  const mas_recomendacion = Number(req.body.mas_recomendacion);
  console.log("Informacion obtenida del resultado:", req.body);

  try {
    if (mejoramiento== null || !mejoramiento)
      return res.status(400).json({ message: "La intensidad de mejora es obligatoria" });
    if (mas_recomendacion== null || !mas_recomendacion)
      return res.status(400).json({ message: "Es obligatorio indicar si se requieren más recomendaciones" });
    
    const errores = validarParrafos(descripcion);
        if(errores > 0){
            return res.status(400).json({message: "Favor de cumplir con el formato solicitado", errores});
        }

     // Obtener la recomendación actual
    const recomendacionExistente = await getRecomendacionById(idRecomendacion);
    if (!recomendacionExistente) {
      return res.status(404).json({ message: "Recomendación no encontrada" });
    }
    const { idProfesional, actividad } = recomendacionExistente;
  // Actualizar la recomendación con los nuevos datos del paciente
    const Recomendacion = await modifyRecomendacionPaciente(idRecomendacion, {
      mejoramiento,
      mas_recomendacion,
    });
  
    if (Recomendacion ===0) {
      return res.status(404).json({ 
          message: "La recomendación no fue modificada. El ID de recomendación no se encontró en la base de datos." 
      });
    }

      const pacienteInfo = await getPacienteByRecomendacion(idRecomendacion);
    const nombrePaciente = pacienteInfo?.nombrePaciente || "Paciente desconocido";

    // Notificación personalizada al profesional
    const idUsuario = await getUsuarioByProfesional(idProfesional);
    if (idUsuario) {

      const mensaje = `
      El paciente ${nombrePaciente || "sin nombre"} 
      ha compartido su avance en la actividad "${actividad}".
      ${mejoramiento === 1 ? "Mencionó que la actividad no ayudó mucho." : 
        mejoramiento === 2 ? "Indicó que tuvo una mejora moderada." : 
        mejoramiento === 3 ? "Reportó una mejora significativa." : ""}
      ${mas_recomendacion === 2 ? "También indicó que desea recibir más recomendaciones." : ""}
      `.trim();

      await crearNotificacion({
        idUsuario,
        titulo: "Nuevo seguimiento de actividad del paciente",
        mensaje,
        tipo: "sistema",
      });

      await notificacionInterna(idUsuario, mensaje);
    } else {
      console.log("El profesional no tiene usuario asociado. No se envió notificación");
    }

    res.json({ message: "Recomendación modificada exitosamente" });
  } catch (err) {
    console.log("Errores al actualizar recomendación:", err);
    res.status(500).json({ error: err.message });
  }
};




// Función para obtener actividades recomendadas para el profesional
export const getRecomendacionesProf = async(req, res) => {
    try{
        const{idProfesional, publico} = req.params;
        console.log("Parametros recibidos:", req.params);

        const resultado = await obtenerRecomendaciones(parseInt(idProfesional), parseInt(publico));
        return res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de recomendaciones filtrados:", err);
        return res.status(500).json({error: err.message});
    }
};

// Función para listarle las actividades recomendadas a los pacientes
export const getRecomendacionesPac = async(req, res) => {
    try{
        const{idPaciente} = req.params;
        console.log("Parametros recibidos:", req.params);

        const resultado = await obtenerRecomendacionesPac(parseInt(idPaciente));
        return res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de recomendaciones:", err);
        return res.status(500).json({error: err.message});
    }
};
