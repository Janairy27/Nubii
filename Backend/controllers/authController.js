import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { 
    createUser, updateUser, changeDate, deleteUser, updatePassword, getUsuariosByAttribute,
    findUserByEmail, findFullUserById, findUserById, findFullUserByEmail, setResetToken, 
    findUserByToken, findUserByAttribute
} from "../models/userModel.js";

import { 
    createPaciente, updatePaciente, deleteRelacionPaciente 
} from "../models/pacienteModel.js";
import { 
    createProfesional, updateProfesional, deleteRelacionProfesional
} from "../models/profesionalModelo.js";

import {
    validarNombre, validarFechaNacimiento, validarTelefono, validarCorreo,
    validarCurp, validarDomicilio, validarCedula
} from "../utils/validaciones.js";
import { sendWelcomeEmail } from "../services/Bienvenida.js";
import { sendInicioSesion } from "../services/inicioSesion.js";
import { Recuperacion } from "../services/recuperacion.js";

//const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Registro de usuario de los tres tipos de usuarios (administrador, paciente y profesional)
export const register = async (req, res) => {

    console.log("REQ BODY:", req.body);
    
    const{
        nombre, apaterno, amaterno, fecha_nacimiento, telefono, email, curp, estado, municipio, calle, contrasena,
        // Segun sea el tipo
        nivel_estres_base, especialidad, cedula,
    } = req.body;

    const sexo = Number(req.body.sexo);
    const tipo_usuario = Number(req.body.tipo_usuario);

    try{
        // Validaciones básicas de los campos
        if(!contrasena) return res.status(400).json({message: "Faltan ingresar contraseña"});
        if(!tipo_usuario) return res.status(400).json({message: "Faltan seleccionar un tipo de usuario"});
        
        // Validación de selección de un tipo de usuario
        if(![2, 3, 1].includes(tipo_usuario)){
            return res.status(400).json({message:"Tipo de usuario inválido"});
        }

        // Validación que contenga los campos los campos llenos
        if(tipo_usuario === 2){
            if(!especialidad) return res.status(400).json({message: "La especialidad es obligatoria"});
        }

        // Validar duplicación de email
        const existeCorreo = await findUserByEmail(email);
        if (existeCorreo) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        // Validación del formato insertado
        let errores = [];

        errores = errores.concat(validarNombre(nombre, apaterno, amaterno));
        errores = errores.concat(validarFechaNacimiento(fecha_nacimiento));
        errores = errores.concat(validarTelefono(telefono));
        errores = errores.concat(validarCorreo(email));
        errores = errores.concat(validarCurp(curp));
        errores = errores.concat(validarDomicilio(estado, municipio, calle));
        if(tipo_usuario === 2){
            errores = errores.concat(validarCedula(cedula));
        }
        
        if (errores.length > 0) {
            console.log("Errores de validación:", errores); 
            return res.status(400).json({
                message: "Cumplir con el formato solicitado",
                errores, 
            });
        }

        // Encriptación de contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Comienzo de transacción de información
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try{
            // Creación de usuario base
            console.log("Creando usuario");
            const id_usuario = await createUser({
                nombre, apaterno, amaterno, fecha_nacimiento, sexo, telefono, email, curp, estado, municipio, calle, tipo_usuario, contrasena:hashedPassword,
            },connection);

            // Segun sea el tipo de usuario
            if(tipo_usuario === 3){
                console.log("Creando paciente");
                await createPaciente(id_usuario, nivel_estres_base, connection);
            }else if(tipo_usuario === 2){
                console.log("Creando profesional");
                await createProfesional(id_usuario, especialidad, cedula, connection);  
            }

            await connection.commit();
            
            try{
                // Mapeo de tipos de usuario para enviarlo por correo electronico
                const tipoUsuarioTesto = {
                    1: "Administrador",
                    2: "Profesional",
                    3: "Paciente"
                }
                const usuario = tipoUsuarioTesto[tipo_usuario];

                console.log("Antes de enviar correo");
                // Envio de correo electronico
                await sendWelcomeEmail(email,nombre, apaterno, usuario);
                console.log("Despues de enviar correo");
            }catch(err){
                console.log("Error en sendWelcomeEmail:", err);
            }
            connection.release();  

            res.status(201).json({message: "Usuario registrado con éxito", id_usuario});
        }catch(err){
            await connection.rollback();
            connection.release();
            res.status(500).json({error: err.message});
        }
    }catch (err){
        console.error('Error al registrar usuario:', err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

// Authenticación con google
export const googleAuth = async(req, res) => {
    
    try {
        const {id_token} = req.doby;
        if(!id_token) return res.status(400).json({message: "Falta de id_token"});

        // Verificar el token de Google
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const {email, name} = payload;

        // Busqueda del usuario en caso de existir en la base de datos nubii
        let user = await findUserByEmail(email);

        if(!user) {
            // asignación por defecto del tipo de usuario como paciente
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try{
                const id_usuario = await createGoogleUser({
                    nombre: name || "Sin nombre",
                    apaterno: "",  
                    email,
                    tipo_usuario: "paciente",
                },connection);

                await createPaciente(id_usuario,5,connection);
                await connection.commit();
                connection.release();

                // Obtener usuario completo para generar token
                user = await findUserByEmail(email);
            }catch(err){
                await connection.rollback();
                connection.release();
                throw RegExp;
            }
        }

        // Creación de JWT propio con actividad de 20 minutos
        const token = jwt.sign({
            id: user.id_usuario, role: user.tipo_usuario, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES});  

        // Envio de respuesta
        res.json({message: "Login con Google exisoto", token, role: user.tipo_usuario, name: user.nombre, email: user.email});
    }catch(err){
        console.error(err);
        res.status(401).json({message: "Token de Google inválido "});
    }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Info Recibida", req.body);

  try {
    let fechaAcceso = new Date().toISOString().split('T')[0];
    console.log("Buscando usuario");
    const user = await findUserByEmail(email);
    console.log("Correo encontrado");
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.contrasena);
    if (!match) return res.status(400).json({ message: "Contraseña incorrecta" });
    console.log("Contraseña correcta");

    const token = jwt.sign(
      { id: user.id_usuario, role: user.tipo_usuario, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    const respuesta = {
      message: "Login exitoso",
      token,
      role: user.tipo_usuario,
      idUsuario: user.idUsuario, // 👈 corrige nombre
      Nombre: user.Nombre,
      aPaterno: user.aPaterno,
      email: user.email,
    };

    // 🔹 No interrumpir el flujo si fallan las tareas secundarias
    try {
      console.log("Actualizando fecha...");
      await changeDate(fechaAcceso, user.idUsuario);
    } catch (error) {
      console.warn("Error al actualizar fecha:", error.message);
    }

    try {
      console.log("Enviando correo...");
      await sendInicioSesion(email, user.Nombre);
    } catch (error) {
      console.warn("Error al enviar correo:", error.message);
    }

    // 🔹 Ahora sí, siempre responder éxito
    return res.status(200).json(respuesta);

  } catch (err) {
    console.error("❌ Error general en login:", err);
    return res.status(500).json({ message: err.message });
  }
};


// Función para cerrar sesión
export const logout = async(req, res) => {
    res.json({message: "Sesión cerrada exitosa"});
};


// Recuperación de contraseña
export const forgotPassword = async(req, res) => {
    console.log("Body:", req.body);

    try {
        const {email} = req.body;
        console.log("Email recibido:", email);
        const user = await findUserByEmail(email);
        console.log("Usuario: ", user);
        if(!user) return res.status(404).json({message: "Usuario no encontrado"});

        const connection = await db.getConnection();
        await connection.beginTransaction();

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        // Corvensión de la fecha a formato de MYSQL válido
        const mysqlFromat = expires.toISOString().slice(0, 19).replace("T", " ");
        console.log("token:", token, "Expires:", mysqlFromat);

        console.log(`Actualizando BD para token, ${user.idUsuario}`);
        await setResetToken(user.idUsuario, token, mysqlFromat, connection);
        console.log("Token guardado en DB");

        const resetLink = `http://else.mx/reset-password?token=${token}`;

         try{
                console.log("Antes de enviar correo");
                // Envio de correo electronico
                await Recuperacion(email, 
                    "Recuperar contraseña",  
                    `<p>Usa este enlace para cambiar la contraseña: <a href="${resetLink}">${resetLink}</a></p>`);
                console.log("Despues de enviar correo");
            }catch(err){
                console.log("Error en sendRecuperationEmail:", err);
                throw new Error("Fallo al enviar correo de recuperación");
            }

            await connection.commit();
            connection.release();
        res.json({message: "Correo enviado si el usuario existe"});

    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Restauracion de contraseña
export const resetPassword = async(req, res) => {
    try{
        const{ token, contrasena} = req.body;
        console.log("Buscando token");
        const user = await findUserByToken(token);
        console.log("Token encontrado: ", token);
        if(!user) return res.status(400).json({message: "Token inválido o expirado"});

        console.log("usuario", user.idUsuario);
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        console.log("Antes de actualizar contraseña", hashedPassword);
        await updatePassword(user.idUsuario, hashedPassword);
        console.log("Despues de actualizar contraseña");

        res.json({message: "Contraseña actualizada"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};


// Actualización de usuario
export const ActualizarUsuario = async (req, res) => {
    console.log("Recibí una petición en update/:id");
    console.log("req.method:", req.method);
    console.log("req.originalUrl:", req.originalUrl);
    console.log("req.params:", req.params);

    const{id} = req.params;
    console.log(`id recibido ${id}`);
    const{
        Nombre, aPaterno, aMaterno, fecha_nacimiento, sexo, telefono, email, curp, estado, 
        municipio, calle, contrasena, nivel_estres, especialidad, cedula
    } = req.body;

    try{
        console.log("buscando ID");
        const user = await findUserById(id);
        console.log("ID encontrado", user);
        if(!user) return res.status(404).json({message: "Usuario no encontrado"});

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try{
             let hashedPassword = user.contrasena; //  mantener la actual por defecto

            // Solo hashear si el campo "contrasena" viene en la petición
             if (contrasena && contrasena.trim() !== "") {
                hashedPassword = await bcrypt.hash(contrasena, 10);
            }

            // Validar que se cumpla con el formato correcto
            let errores = [];

            errores = errores.concat(validarNombre(Nombre, aPaterno, aMaterno));
            errores = errores.concat(validarFechaNacimiento(fecha_nacimiento));
            errores = errores.concat(validarTelefono(telefono));
            errores = errores.concat(validarCorreo(email));
            errores = errores.concat(validarCurp(curp));
            errores = errores.concat(validarDomicilio(estado, municipio, calle));
            if(user.tipo_usuario === 2){
                errores = errores.concat(validarCedula(cedula));
            }

            if (errores.length > 0) {
                console.log("Errores de validación:", errores); 
                return res.status(400).json({
                    errores, 
                });
            }

            console.log("antes de actualizar usuario");
            // Actualizar el usuario base
            await updateUser(id, {Nombre, aPaterno, aMaterno, fecha_nacimiento, sexo, telefono, email, curp, estado,
                municipio, calle, contrasena:hashedPassword}, connection);
            console.log("despues de actualizar usuario");

            // Actualizar tablas de tipo de usuarios
            if(user.tipo_usuario === 3){
                console.log("antes de actualizar paciente");
                await updatePaciente(id, nivel_estres, connection);
                console.log("despues de actualizar paciente");
            }else if(user.tipo_usuario === 2){
                console.log("antes de actualizar profesional");
                await updateProfesional(id, especialidad, cedula, connection);
                console.log("despues de actualizar profesional")
            }

            await connection.commit();
            connection.release();

            res.json({message: "Usuario actualizado con éxito"});

        }catch(err){
            await connection.rollback();
            connection.release();
            res.status(500).json({error: err.message});
        }

    }catch(err){
        res.status(500).json({error: err.message});
    }

};


// Eliminar usuario
export const EliminarUsuario = async(req, res) => {
    console.log("Recibí una petición en delete/:id");
    console.log("req.method:", req.method);
    console.log("req.originalUrl:", req.originalUrl);
    console.log("req.params:", req.params);

    const {id} = req.params;
    console.log(`Id resivido: ${id}`);

    try{
        const user = await findUserById(id);
        console.log("Informacion del usuario", user);
        if(!user) return res.status(404).json({message: "Usuario no encontrado"});

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try{
            // Eliminar primero las relaciones existentes
            console.log("antes de eliminar relaciones");
            if(user.tipo_usuario === 2){
                await deleteRelacionProfesional(id, connection);
            }else if (user.tipo_usuario === 3){
                await deleteRelacionPaciente(id, connection);
            }
            console.log("Despues de eliminar relaciones");

            // Eliminar usuario base
            console.log("antes de eliminar Usuario");
            await deleteUser(id, connection);
            console.log("Despues de eliminar usuario");

            await connection.commit();
            connection.release();

            res.json({message: "Usuario eliminado con éxito"});
        }catch(err){
            await connection.rollback();
            connection.release();
            res.status(500).json({error: err.message});
        }
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Busqueda de usuario por email
export const getUserByEmail = async(req, res) => {
    const {email} = req.params;
    console.log("Email RECIBIDO", email);
    try{
        const user = await findFullUserByEmail(email);
        if(!user) return res.status(404).json({message: "Usuario no encontrado"});
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Busqueda de usuario por id
export const getFullUserById = async(req, res) => {
    const {id} = req.params;
    console.log(`id recibido ${id}`);
    try{
        const user = await findFullUserById(id); 
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Busqueda de usuarios dependiendo el tipo especificado por el Administrador
export const getUserByAttribute = async(req, res) => {
    const {atributo, valor} = req.params;
    try{
        // Mapeo de atributos validos para la busqueda
        const atributoPermitidos = {
            nombre: 'u.nombre',
            apellido: 'u.aPaterno',
            email: 'u.email',
            nivel_estres: 'p.nivel_estres',
            especialidad: 'pr.especialidad',
            ceduola: 'pr.cedula'
        };

        const consulta = atributoPermitidos[atributo];

        if(!consulta){
            return res.status(400).json({message: "Atributo no válido"});
        }

        const resultado = await findUserByAttribute(consulta, valor);
        res.json(resultado);
        
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Obtener información de todos los usuarios para búsqueda dinamica (vista Admin)
export const getUsuariosByFilter = async(req, res) => {
    try{
        const {nombreUsuario, email, estado, tipo_usuario, especialidad} = req.query;
        console.log("Paramétros recibidos:", req.query);

        // Consersión de parámetros
        const filtros = {
            nombreUsuario: nombreUsuario || undefined,
            email: email || undefined,
            estado: estado || undefined,
            tipo_usuario: tipo_usuario ? parseInt(tipo_usuario): undefined,
            especialidad: especialidad ? parseInt(especialidad): undefined
        };

        const resultado = await getUsuariosByAttribute(filtros);
        res.json(resultado);
    }catch(err){
        console.log("Error en la obtención de usuarios filtradas:", err);
        res.status(500).json({error: err.message});
    }
};