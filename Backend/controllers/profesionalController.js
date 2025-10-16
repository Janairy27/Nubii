import { 
    findProfesionalByUsuario 
} from "../models/profesionalModelo.js";


// Obtener profesional a travez del idUsuario
export const getProfesionalByidUsuario = async(req, res) =>{
    const {idUsuario} = req.params;
    console.log(`Id del usuario ${idUsuario}`);
    try{
        //
        const user = await findProfesionalByUsuario(idUsuario);
        if(!user) return res.status(404).json({message: "Profesional no encontrado"});
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};