import { 
    createPaciente, updatePaciente, deleteRelacionPaciente, findPacienteByUsuario 
} from "../models/pacienteModel.js";

// Obtener Paciente a travez del idUsuario
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