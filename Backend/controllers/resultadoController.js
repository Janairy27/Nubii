import {
    createResultadoT, updateResultados, deleteResultados,
    getResultadoByAtrributeProf, getResultadoByAtrributePac
} from "../models/resultadoModel.js";

import { validarResultados } from "../utils/validaciones.js";

// Registro de recordatorios
export const registrarResultado = async(req, res) => {
    console.log("Información del recordatorio obtenido:", req.body);

    const{tipo_test, interpretacion, recomendacion} = req.body;
    let fecha_aplicacion = req.body.fecha_aplicacion;
    const idProfesional = Number(req.body.idProfesional);
    const idPaciente = Number(req.body.idPaciente);
    const puntaje = Number(req.body.puntaje);
    const categ_resultado = Number(req.body.categ_resultado);

    try{
        // Validación de campos nulos
        if(!idPaciente) return res.status(404).json({message: "Paciente obligatorio"});
        if(!tipo_test) return res.status(404).json({message: "Tipo de test obligatorio"});
        if(!puntaje) return res.status(404).json({message: "Puntaje obligatorio"});
        if(!categ_resultado) return res.status(404).json({message: "Categoria de resultados obligatorio"});    

        // Validar formatos textuales
        const errores = validarResultados(interpretacion, recomendacion);
        if(errores > 0){
            return res.status(400).json({message: "Favor de cumplir con el formato solicitado", errores});
        }

        try{
            if(fecha_aplicacion === ""){
                fecha_aplicacion = new Date().toISOString().split('T')[0];
            }
            // Almacenar la información
            console.log("Insertando resultados de test");
            const idResultadoT = await createResultadoT({
                idProfesional, idPaciente, tipo_test, fecha_aplicacion, puntaje, categ_resultado, interpretacion, recomendacion
            });
            console.log("Resultado de test creado con id:", idResultadoT);
            res.status(201).json({message: "Resultado creado con éxito"});
        }catch(err){
            console.log("Error al crear Resultado de test", err.message);
            res.status(500).json({error: err.message});
        }
    }catch(err){
        console.log("Error al registrar resultado", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

// Función para actualizar resultados
export const ActualizarResultadoT = async(req, res) => {
    const {idResultadoT} = req.params;
    console.log("ID de los resultados de test:", idResultadoT);

    const{tipo_test, interpretacion, recomendacion} = req.body;
    const puntaje = Number(req.body.puntaje);
    const categ_resultado = Number(req.body.categ_resultado);
    console.log("Informacion obtenida del resultado:", req.body);

    try{
        if(!tipo_test) return res.status(404).json({message: "Tipo de test obligatorio"});
        if(!puntaje) return res.status(404).json({message: "Puntaje obligatorio"});
        if(!categ_resultado) return res.status(404).json({message: "Categoria de resultados obligatorio"});    

        // Validar formatos textuales
        const errores = validarResultados(interpretacion, recomendacion);
        if(errores > 0){
            return res.status(400).json({message: "Favor de cumplir con el formato solicitado", errores});
        }

        console.log("Actualizando resultados con id:", idResultadoT);
        const Resultado = await updateResultados(idResultadoT, {tipo_test, puntaje, categ_resultado, interpretacion, recomendacion});
        console.log("Resultados actualizados");
        if(!Resultado){
            return res.status(404).json({message: "El test no fue actualizado"});
        }

        res.json({message: "Test actualizado exitosamente"});
    }catch(err){
        console.log("Errores al actualizar test:", err);
        res.status(500).json({error: err.message});
    }
};

// Función para eliminar evidencia
export const EliminarResultadoT = async(req, res) => {
    const {idResultadoT} = req.params;
    console.log("ID del test recibido:", idResultadoT);
    try{
        await deleteResultados(idResultadoT);
        res.json({message: "Test eliminado con éxito"});
    }catch(err){
        console.log("Error al eliminar test:", err);
        res.status(500).json({error: err.message});
    }
};








// función para hacer busqueda de los resultados almacenados de forma dinamica para los profesionales
export const getResultadoByFilterProf = async(req, res) => {
    try{
        const{idProfesional, nombrePaciente, tipo_test, fecha_aplicacion, categ_resultado, interpretacion} = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            nombrePaciente: nombrePaciente || undefined,
            tipo_test: tipo_test || undefined,
            fecha_aplicacion: fecha_aplicacion || undefined,
            categ_resultado: categ_resultado ? parseInt(categ_resultado): undefined,
            interpretacion: interpretacion || undefined
        };

        const resultado = await getResultadoByAtrributeProf(filtros, parseInt(idProfesional));
        res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de resultados de test filtradas:", err);
        res.status(500).json({error: err.message});
    }
};

// función para hacer busqueda de los resultados almacenados de forma dinamica para los pacientes
export const getResultadoByFilterPac = async(req, res) => {
    try{
        const{idPaciente, nombreProfesional, tipo_test, fecha_aplicacion, categ_resultado, interpretacion} = req.query;
        console.log("Parametros recibidos:", req.query);

        const filtros = {
            nombreProfesional: nombreProfesional || undefined,
            tipo_test: tipo_test || undefined,
            fecha_aplicacion: fecha_aplicacion || undefined,
            categ_resultado: categ_resultado ? parseInt(categ_resultado): undefined,
            interpretacion: interpretacion || undefined
        };

        const resultado = await getResultadoByAtrributePac(filtros, parseInt(idPaciente));
        res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de resultados de test filtradas:", err);
        res.status(500).json({error: err.message});
    }
};
