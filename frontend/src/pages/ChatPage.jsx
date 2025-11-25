import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Divider,
  Tooltip,
  Paper,
  Fade,
  Container,
} from "@mui/material";
import axios from "axios";
import Layout from "../components/Layout";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatInput from "../components/Chat/ChatInput";
import { enviarMensaje, obtenerChat } from "../services/chatService";

import PsychologyIcon from "@mui/icons-material/Psychology";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HealingIcon from "@mui/icons-material/Healing";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

// 🌈 Mapa de especialidades
const especialidadMap = [
  { value: 1, nombre: "Psicólogo", icono: <PsychologyIcon />, color: "#ab47bc" },
  { value: 2, nombre: "Psiquiatra", icono: <MedicalServicesIcon />, color: "#42a5f5" },
  { value: 3, nombre: "Terapeuta", icono: <HealingIcon />, color: "#26a69a" },
  { value: 4, nombre: "Neurólogo", icono: <LocalHospitalIcon />, color: "#ef5350" },
  { value: 5, nombre: "Médico General", icono: <FavoriteIcon />, color: "#66bb6a" },
  { value: 6, nombre: "Psicoterapeuta", icono: <SelfImprovementIcon />, color: "#ffa726" },
  { value: 7, nombre: "Psicoanalista", icono: <EmojiObjectsIcon />, color: "#8d6e63" },
  { value: 8, nombre: "Consejero", icono: <SupportAgentIcon />, color: "#29b6f6" },
  { value: 9, nombre: "Trabajador Social", icono: <SupervisorAccountIcon />, color: "#ffa726" },
];

//const socket = io("http://localhost:4000", {query: { role: "paciente", id: localStorage.getItem("idPaciente") }});
let socket;
const ChatPage = () => {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idPaciente, setIdPaciente] = useState(null);
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(true);

  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [chatActual, setChatActual] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  //const [profesionalSeleccioando, setProfresionalSeleccionado] = useState(null);
  const [mensajesNuevos, setMensajesNuevos] = useState({}); // {idPaciente: cantidad}
  // [mensaje, setMensaje] = useState("");

    const chatActualRef = useRef(chatActual);
  useEffect(() => {
    chatActualRef.current = chatActual;
  }, [chatActual]);


  // 1️⃣ Obtener paciente
  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (!storedIdUsuario) return;

    setIdUsuario(storedIdUsuario);
    axios
      .get(`http://localhost:4000/api/auth/paciente/${storedIdUsuario}`)
      .then((res) => {
        const paciente = res.data;
        const pacIdStr = Number(paciente.idPaciente);
        setIdPaciente(paciente.idPaciente);
        setNombre(res.data.nombre);
        
        if (paciente.especialidad) setEspecialidadSeleccionada(paciente.especialidad);
        socket = io("http://localhost:4000", {
          query: { role: "paciente", id: String(pacIdStr) }, // Aseguramos que sea un string
        });
        socket.on("connect", () => {
          console.log("Socket conectado con ID:", socket.id);
          socket.emit("join", storedIdUsuario);
        });

        socket.on("connect_error", (err) => {
          console.error("Error al conectar Socket:", err.message);
        });
      })
      .catch((err) => console.error("Error al obtener paciente:", err))
      .finally(() => setCargando(false));

      return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // 2️⃣ Cargar profesionales
  useEffect(() => {
    if (!especialidadSeleccionada) return;
    axios
      .get(`http://localhost:4000/api/auth/profesionales/${especialidadSeleccionada}`)
      .then((res) => setProfesionales(res.data))
      .catch((err) => console.error("Error al obtener profesionales:", err));
  }, [especialidadSeleccionada]);

  // 3️⃣ Escuchar mensajes nuevos
  useEffect(() => {
    if (!idPaciente || !socket) return;
    
    const idPacStr = String(idPaciente);

    const handleNuevoMensaje = (msg) => {
      const profId = String(msg.idProfesional);
      const pacId = String(msg.idPaciente);
      const isSenderPac = msg.enviado === "paciente";

      if (pacId !== idPacStr) return;

       // Si el mensaje vino del paciente 
      if (isSenderPac) {
          return; 
      }

      const profesional = {
        idProfesional: profId,
        nombreProfesional: msg.nombreProfesional || `Profesional ${profId}`,
      };
      // 🔹 Si chat abierto con este paciente → agregar mensaje
      //const isChatOpen = chatActualRef.current?.idProfesional === profId;
      if (chatActualRef.current?.idProfesional === profId) {
        const body = { lectorRol: 'paciente' };
        setMensajes((prev) => [...prev, msg]);

        // Marcar mensaje como leído en backend
        axios.put(
          `http://localhost:4000/api/chat/leido/${idPaciente}/${profId}`, 
          body
        );
        // Limpiar el contador localmente
         setMensajesNuevos((prev) => ({
          ...prev,
          [profId]: 0,
        }));
      
       } else {
         // 1. Incrementar contador
        setMensajesNuevos((prev) => ({
          ...prev,
          [profId]: (prev[profId] || 0) + 1,
        }));
        //setProfresionalSeleccionado(profesional);
         setProfesionales((prev) =>
          prev.some((p) => String(p.idProfesional) === profId) ? prev : [...prev, profesional]
        );
         }
    };
    
    socket.on("nuevo_mensaje", handleNuevoMensaje);
    return () => socket.off("nuevo_mensaje", handleNuevoMensaje);
  }, [ idPaciente]);


  // -------------------------------
  // 4️⃣ Obtener mensajes no leídos al cargar
  // -------------------------------
  useEffect(() => {
    // Soluciona la advertencia 'Esperando idProfesional válido...' al inicio
    if (typeof idPaciente !== 'number' || idPaciente <= 0) { // Verificación adicional de Number
      console.warn("Esperando idPaciente válido para cargar no leídos...");
      return;
    }

    const idPacienteNum = idPaciente;


    console.log("Solicitando mensajes no leídos para idProfesional:", idPacienteNum);

    axios
      .get(`http://localhost:4000/api/chat/no-leidosPac/${idPacienteNum}`)
      .then((res) => {
        console.log("Mensajes no leídos:", res.data);
        //const nuevosNoLeidos = res.data.reduce((acc, item) => {
        // Asumimos que res.data tiene la forma { idPaciente: string, count: number }
        //  acc[String(item.idPaciente)] = Number(item.count);
        // return acc;
        //}, {});

        setMensajesNuevos(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener mensajes no leídos:", err.response?.data || err.message);
      });
  }, [idPaciente]);


  // 4️⃣ Cargar chat
  const cargarChat = async (profesional) => {
    const profesionalId = String(profesional.idProfesional);
    setChatActual(profesional);

    const pacIdNum = idPaciente;
    const body = { lectorRol: 'paciente' };
    try{
          const data = await obtenerChat( pacIdNum, profesionalId);
              setMensajes(data);
           await axios.put(`http://localhost:4000/api/chat/leido/${pacIdNum}/${profesionalId}`,
        body
      );

       // Limpiar contador (poner en 0)
      setMensajesNuevos((prev) => ({
        ...prev,
        [profesionalId]: 0,
      }));

      
    }catch (err) {
      console.error("Error al cargar chat:", err.response?.data || err.message);
    }



  };

  // 5️⃣ Enviar mensaje
  const handleSend = async (mensajeTexto) => {
    if (!chatActual || !mensajeTexto.trim()) return;

    const data = {
      idPaciente: idPaciente,
      idProfesional: String(chatActualRef.current.idProfesional),
      mensaje: mensajeTexto,
      enviado: "paciente",
      nombre: nombre
    };

    try {
      let msg = await enviarMensaje(data);
      if (!msg.enviado) {
          msg = { ...msg, enviado: 'paciente' };
      }

      setMensajes((prev) => [...prev, msg]);
      if (socket) {
        // Usamos el objeto completo devuelto por la API (msg)
        socket.emit("enviar_mensaje", msg); 
      }
      //setMensaje("");
    } catch (err) {
      console.error("❌ Error enviando mensaje:", err);
    }
  };

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 4,
          pb: 4,
          minHeight: "100vh",
        }}
      >
        <Fade in timeout={500}>
          <Box
            display="flex"
            height="100vh"
            sx={{
              bgcolor: "#f4f6f8",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            }}
          >
            {/* 🔹 Sidebar */}
            <Box
              width={320}
              sx={{
                bgcolor: "#F4F6F8",
                color: "#fff",
                p: 2,
                overflowY: "auto",
              }}
            >

              <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", textAlign: "center", color: "#092181" }}>
                Especialidades
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center", color: "#092181" }}>
                Selecciona una especialidad para enviarle un mensaje a un profesional
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1.2} justifyContent="center">
                {especialidadMap.map((esp) => (
                  <Tooltip key={esp.value} title={esp.nombre}>
                    <Avatar
                      sx={{
                        bgcolor:
                          especialidadSeleccionada === esp.value ? esp.color : "#c4d1e9ff",
                        color:
                          especialidadSeleccionada === esp.value ? "#fff" : esp.color,
                        cursor: "pointer",
                        width: 50,
                        height: 50,
                        transition: "0.3s",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: `0 0 10px ${esp.color}`,
                        },
                      }}
                      onClick={() => setEspecialidadSeleccionada(esp.value)}
                    >
                      {esp.icono}
                    </Avatar>
                  </Tooltip>
                ))}
              </Box>

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.3)" }} />


              <Paper
                elevation={3}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  maxHeight: "65vh",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(255,255,255,0.4)",
                    borderRadius: "10px",
                  },
                }}
              >
                <ChatList profesionales={profesionales} onSelect={cargarChat}
                  mensajesNuevos={mensajesNuevos} />
              </Paper>
            </Box>

            {/* 🔹 Chat principal */}
            <Box display="flex" flexDirection="column" flex={1}>
              {chatActual ? (
                <>
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      background: " #315771ff ",
                      color: "#fff",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#ffffff",
                        color: "#2D5D7B",
                        fontWeight: "bold",
                        width: 48,
                        height: 48,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {chatActual.nombre?.[0]?.toUpperCase() ||
                        chatActual.nombreProfesional?.[0]?.toUpperCase()}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#fff",
                          letterSpacing: "0.5px",
                          lineHeight: 1.2,
                        }}
                      >
                        {chatActual.nombre || chatActual.nombreProfesional}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {especialidadMap.find((e) => e.value === chatActual.especialidad)?.nombre ||
                          "Especialista"}
                      </Typography>
                    </Box>
                  </Box>

                  <ChatWindow mensajes={mensajes} usuarioActual={idPaciente} />
                  <ChatInput onSend={handleSend} />
                </>
              ) : (
                <Box
                  display="flex"
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  color="text.secondary"
                  sx={{ bgcolor: "#fafafa", fontStyle: "italic" }}
                >
                  Selecciona un profesional para iniciar el chat
                </Box>
              )}
            </Box>
          </Box>
        </Fade>
      </Container>
    </Layout>
  );
};

export default ChatPage;
