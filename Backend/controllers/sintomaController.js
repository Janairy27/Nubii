import {createSintoma, updateSintoma, deleteSintoma,
    findSintomaById, getSintomasByPacienteDesc, findSintomaByAttribute, 
    findSintomaByAttributePaciente 
} from "../models/sintomaModel.js";

const SOLO_LETRAS_ExpReg = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;

// Validar que la información sea textual
function validar(detonante, ubicacion, actividadReciente, nota){
    const errores = [];
    if(!detonante || !SOLO_LETRAS_ExpReg.test(detonante)){
        errores.push("El detonante debe contener solo letras");
    }

    if(!ubicacion || !SOLO_LETRAS_ExpReg.test(ubicacion)){
        errores.push("La ubicación deberá contener solo letras");
    }

    if(!actividadReciente || !SOLO_LETRAS_ExpReg.test(actividadReciente)){
        errores.push("La actividad deberá contener solo letras");
    }

    if(nota && !SOLO_LETRAS_ExpReg){
        errores.push("Las notas deberan contener solo letras");
    }
    return errores;
}

// Registro de sintoma
export const registrarSintoma = async(req, res) => {
    console.log("Información obtenida", req.body);

    const{
        fecha, detonante, ubicacion, actividadReciente, nota,
    } = req.body;

    const idPaciente = Number(req.body.idPaciente);
    const emocion = Number(req.body.emocion);
    const intensidad = Number(req.body.intensidad);
    const clima = Number(req.body.clima);

    try{
        // Validaciones de campos nulos
        if(!emocion || !intensidad || !detonante || !ubicacion || !clima || !actividadReciente){
            return res.status(400).json({message: "Faltan campos por completar"});
        }

        // Validación del formato (contener solo letras)
        const errores = validar(detonante, ubicacion, actividadReciente, nota);
        if(errores.length > 0){
            console.log("Errores de validación:", errores);
            return res.status(400).json({message: "Cumplir con el formato solicitado", errores});
        }

        try{
            // Ingreso de la información de sintomas
            console.log("Ingresando sintoma");
            const idSintoma = await createSintoma({
                idPaciente, fecha, emocion, intensidad, detonante, ubicacion, clima, actividadReciente, nota
            });
            console.log("Sintoma creado con id:", idSintoma);
            res.status(201).json({message: "Sintoma creado con éxito"});
        }catch(err){
            console.log("Error al crear sintoma", err.message);
            res.status(500).json({error: err.message});
            console.log("Error completo:", err);
        }

    }catch(err){
        console.log("Error al registrar sintoma", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

// Función de actualizar sintoma
export const ActualizarSintoma = async(req, res) => {
    
    const {idSintoma} = req.params;
    console.log(`ID del sintoma ${idSintoma}`);

    const{
        fecha, detonante, ubicacion, actividadReciente, nota,
    } = req.body;

    const emocion = Number(req.body.emocion);
    const intensidad = Number(req.body.intensidad);
    const clima = Number(req.body.clima);
    console.log("Información obtenida:", req.body);

    try{
        
        // Validar que los campos fueron ingresados de forma correcta
        const errores = validar(detonante, ubicacion, actividadReciente, nota);
        if(errores.length > 0){
            return res.status(400).json({message: "Errores de validacion", errores});
        }

        console.log(`Actualizando síntoma con id ${idSintoma}`);
        const actualizando = await updateSintoma(idSintoma, {fecha, emocion, intensidad,
            clima, detonante, ubicacion, actividadReciente, nota
        });

        if(!actualizando){
            return res.status(404).json({message: "El síntoma no fue actualizado"});
        }

        res.json({message: "Síntoma actualizado exitosamente"});
        
    }catch(err){
        console.error("Error al actualizar síntoma:", err);
        res.status(500).json({error: err.message});
    }
};

// Función de eliminar síntoma
export const EliminarSintoma = async(req, res) => {
    const {idSintoma} = req.params;
    console.log(`id del sintoma recibido: ${idSintoma}`);
    
    try{
        await deleteSintoma(idSintoma);
        res.json({message: "Síntoma eliminado con éxito"});

    }catch(err){
        console.log("Error al eliminar sintoma:", err);
        res.status(500).json({error: err.message});
    }
};

// Función que permite listar todos los sintomas de los pacientes
export const getSintomasByidPaciente = async(req, res) => {
    const {idPaciente} = req.params;
    console.log(`id del paciente obtenido para sintomas ${idPaciente}`);

    try{
        const sintoma = await getSintomasByPacienteDesc(idPaciente);
        console.log("Sintomas obtenidos");
        if(!sintoma) return res.status(404).json({message: "Síntoma no encontrado"});
        res.json(sintoma);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Función que permite hacer busqueda de sintomas a traves de criteros a los administradores y profeisonales
export const getSintomasByAttribute = async(req, res) =>{
    const {atributo, valor} = req.params;
    try{
        const atributosPermitidos = {
            nombre: 'nombre',
            fecha: 'fecha',
            emocion: 'emocion',
            intensidad: 'intensidad',
            detonante: 'detonante',
            ubicacion: 'ubicacion',
            clima: 'clima',
            actividadReciente: 'actividadReciente'
        };

        const consulta = atributosPermitidos[atributo];

        if(!consulta){
            return res.status(400).json({message: "Atributo no válido"});
        }

        const resultado = await findSintomaByAttribute(consulta, valor);
        res.json(resultado);

    }catch(err){
        esr.status(500).json({error: err.message});
    }
};

// Función que permite hacer busqueda de sintomas a traves de criteros
export const getSintomasByAttributePaciente = async(req, res) =>{
    const {atributo, valor, idPaciente} = req.params;
    try{
        const atributosPermitidos = {
            fecha: 'fecha',
            emocion: 'emocion',
            intensidad: 'intensidad',
            detonante: 'detonante',
            ubicacion: 'ubicacion',
            clima: 'clima',
            actividadReciente: 'actividadReciente'
        };

        const consulta = atributosPermitidos[atributo];

        if(!consulta){
            return res.status(400).json({message: "Atributo no válido"});
        }

        const resultado = await findSintomaByAttributePaciente(consulta, valor, idPaciente);
        res.json(resultado);

    }catch(err){
        res.status(500).json({error: err.message});
    }
};

