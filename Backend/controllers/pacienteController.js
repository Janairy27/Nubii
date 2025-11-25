import { 
    createPaciente, updatePaciente, deleteRelacionPaciente, findPacienteByUsuario, FindPacientes 
} from "../models/pacienteModel.js";

// Obtener Paciente a través del idUsuario
export const getPacienteByidUsuario = async(req, res) =>{
    const {idUsuario} = req.params;
    console.log(`Id del usuario ${idUsuario}`);
    try{
        const user = await findPacienteByUsuario(idUsuario);
        if(!user) return res.status(404).json({message: "Paciente no encontrado"});
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Función para mostrar todos los pacientes
export const getPacientes = async(req, res) => {
    try{
        const user = await FindPacientes();
        if(!user) return res.status(404).json({message: "Sin registro de pacientes"});
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};