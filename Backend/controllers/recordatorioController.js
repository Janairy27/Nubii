import {
    createRecordatorio,marcadoEnviado, obtenerPendientes,
    updateRecordatorio, deleteRecordatorio,
    getRecordatorioByAttribute, 
} from "../models/recordatorioModel.js";
import {Ejecutarse} from "../services/frecuencia.js";
import { notificacionInterna, RecordatorioEmail } from "../services/recordatorio.js";
import { validarRecordatorio } from "../utils/validaciones.js";
import { crearNotificacion } from "../models/notificacionModel.js";
import moment from "moment";


// Registro de recordatorios
export const registrarRecordatorio = async (req, res) => {
  console.log("Información de recordatorios obtenida:", req.body);

  const { mensaje, hora, tipo_recordatorio } = req.body;
  const frecuencia = Number(req.body.frecuencia);
  const idUsuario = Number(req.body.idUsuario);
  const notificacion = Number(req.body.notificacion);

  try {
    if (!frecuencia)
      return res.status(400).json({ message: "La frecuencia es obligatoria" });
    if (!tipo_recordatorio)
      return res.status(400).json({ message: "El tipo de recordatorio es obligatorio" });
    if (!notificacion)
      return res.status(400).json({ message: "Tipo de notificación obligatorio" });

    let errores = validarRecordatorio(mensaje, hora);
    if (errores.length > 0) {
      console.log("Errores de validación capturados:", errores);
      return res.status(400).json({ message: "Favor de cumplir con el formato", errores });
    }

    console.log("Insertando recordatorio");
    const idRecordatorio = await createRecordatorio({
      mensaje,
      hora,
      frecuencia,
      tipo_recordatorio,
      idUsuario,
      notificacion,
    });

    console.log("Recordatorio creado con id:", idRecordatorio);

    console.log("Iniciando creación de notificación de registro...");

    //  Crear notificación interna automáticamente
    await crearNotificacion({
      idUsuario,
      titulo: "Nuevo recordatorio creado",
      mensaje: `Se ha registrado un recordatorio: "${mensaje}"`,
      tipo: "recordatorio",
    });
    console.log("Notificación de registro finalizada con éxito.");

    res.status(201).json({ message: "Recordatorio creado y notificado con éxito" });
  } catch (err) {
    console.log("Error al registrar recordatorio", err);
    res.status(500).json({ error: "Error interno" });
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
       let errores = validarRecordatorio(mensaje, hora);
    if (errores.length > 0) {
      console.log("Errores de validación capturados:", errores);
      return res.status(400).json({ message: "Favor de cumplir con el formato", errores });
    }
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
export const procesarRecordatorios = async () => {
  //const ahora = moment().format('HH:mm');
  const recordatorios = await obtenerPendientes();
  if (!recordatorios || recordatorios.length === 0) {
    console.log(" No hay recordatorios pendientes");
    return;
  }

  console.log(` Procesando ${recordatorios.length} recordatorios pendientes...`);

  for (const rec of recordatorios) {
    try {
     
      // Verifica si debe ejecutarse según la frecuencia y la última fecha de envío
      const ejecutar = Ejecutarse(rec.frecuencia, rec.fechaEnvio);
      if (!ejecutar) continue;

      //  Enviar según el tipo de notificación
      if (rec.notificacion === 1) {
        await RecordatorioEmail(rec.email, rec.nombreUsuario, rec.mensaje, rec.tipo_recordatorio);
      } else if (rec.notificacion === 2) {
        await notificacionInterna(rec.idUsuario, rec.mensaje);
      }

      //  Marcar como enviado (actualiza fechaEnvio en BD)
      await marcadoEnviado(rec.idRecordatorio);

      //  Crear notificación interna
      await crearNotificacion({
        idUsuario: rec.idUsuario,
        titulo: "Recordatorio Pendiente",
        mensaje: `Tienes un recordatorio pendiente: "${rec.mensaje}". Por favor, revisa tus pendientes`,
        tipo: "recordatorio",
      });

      console.log(`Recordatorio ${rec.idRecordatorio} procesado y notificado`);

    } catch (err) {
      console.error(` Error procesando recordatorio ${rec.idRecordatorio}:`, err);
    }
  }
};


// Función para realizar la búsqueda de recordatorios
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

