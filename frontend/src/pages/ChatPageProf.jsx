import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
   DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Paper,
  Container,
  Avatar
} from "@mui/material";
import axios from "axios";
import Layout from "../components/LayoutProf";
import {
  Menu as MenuIcon,
  ExitToApp,
  Dashboard,
  CheckCircle
} from "@mui/icons-material";
import ChatListProfesional from "../components/Chat/ChatListProfesional";
import ChatWindowProfesional from "../components/Chat/ChatWindowProfesional";
import ChatInputProfesional from "../components/Chat/ChatInputProfesional";
import { enviarMensaje, obtenerChat } from "../services/chatService";
import { motion, AnimatePresence } from "framer-motion";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// ---------------------
// Conexión Socket.io
// ---------------------
//const socket = io("http://localhost:4000", {query: { role: "profesional", id: localStorage.getItem("idProfesional") },});
let socket;
const ChatPageProfesional = () => {
  const [idUsuario, setIdUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [nombre, setNombre] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [chatActual, setChatActual] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados de notificación y mensajes no leídos
  const [openDialog, setOpenDialog] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mensajesNuevos, setMensajesNuevos] = useState({}); // {idPaciente: cantidad sin leer}

  const chatActualRef = useRef(chatActual);
  useEffect(() => {
    chatActualRef.current = chatActual; 
  }, [chatActual]);

  // -------------------------------
  // 1️⃣ Cargar profesional
  // -------------------------------
  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (!storedIdUsuario) {
      setCargando(false);
      return;
    }

    setIdUsuario(storedIdUsuario);
    axios
      .get(`http://localhost:4000/api/auth/profesional/${storedIdUsuario}`)
      .then((res) => {
        console.log("Profesional obtenido:", res.data);
        const profesional = res.data;
        const profIdNum = Number(profesional.idProfesional);
        setIdProfesional(profIdNum);
        setNombre(res.data.nombre);
        socket = io("http://localhost:4000", {
          query: { role: "profesional", id: String(profIdNum) }, // Aseguramos que sea un string
        });
        socket.on("connect", () => {
          console.log("Socket conectado con ID:", socket.id);
          socket.emit("join", storedIdUsuario);
        });

        socket.on("connect_error", (err) => {
          console.error("Error al conectar Socket:", err.message);
        });
      })
      .catch((err) =>
        console.error("Error al obtener profesional:", err.response?.data || err.message)
      )
      .finally(() => setCargando(false));
    // Función de limpieza para desconectar
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // -------------------------------
  // 2️⃣ Cargar pacientes
  // -------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/auth/pacientes")
      .then((res) => setPacientes(res.data))
      .catch((err) =>
        console.error("Error al obtener pacientes:", err.response?.data || err.message)
      );
  }, []);

  // -------------------------------
  // 3️⃣ Escuchar mensajes en tiempo real
  // -------------------------------
  useEffect(() => {
    if (!idProfesional || !socket) return;
    const idProfesionalStr = String(idProfesional);

    const handleNuevoMensaje = (msg) => {
      const pacienteId = String(msg.idPaciente);
      const profId = String(msg.idProfesional);
      const isSenderProf = msg.enviado === "profesional";

      if (profId !== idProfesionalStr) return;

    
      // Si el mensaje vino del profesional (isSenderProf es true) Y el chat está abierto
      if (isSenderProf ) {

          return; // 🛑 Detiene la ejecución para evitar la lógica de "else" (notificación)
      }
        const paciente = {
        idPaciente: pacienteId,
        nombrePaciente: msg.nombrePaciente || `Paciente ${pacienteId}`,
      };

      if (chatActualRef.current?.idPaciente === pacienteId) {
        // Chat abierto → mostrar mensaje y marcar leído
        const body = { rolLector: 'profesional' };
        setMensajes((prev) => [...prev, msg]);
        axios.put(`http://localhost:4000/api/chat/leido/${pacienteId}/${idProfesional}`,
          body
        );
        setMensajesNuevos((prev) => ({
             ...prev,
             [pacienteId]: 0,
        }));
      } else{

        // 1. Incrementar contador
        setMensajesNuevos((prev) => ({
          ...prev,
          [pacienteId]: (prev[pacienteId] || 0) + 1,
        }));
        

        setPacienteSeleccionado(paciente);
        setOpenDialog(true);

        setPacientes((prev) =>
          prev.some((p) => String(p.idPaciente) === pacienteId) ? prev : [...prev, paciente]
        );

       
      }
    };

    socket.on("nuevo_mensaje", handleNuevoMensaje);
    return () => socket.off("nuevo_mensaje", handleNuevoMensaje);
  }, [idProfesional]);

  // -------------------------------
  // 4️⃣ Obtener mensajes no leídos al cargar
  // -------------------------------
  useEffect(() => {
    // Soluciona la advertencia 'Esperando idProfesional válido...' al inicio
    if (typeof idProfesional !== 'number' || idProfesional <= 0) { // Verificación adicional de Number
      console.warn("Esperando idProfesional válido para cargar no leídos...");
      return;
    }

    const idProfesionalNum = idProfesional;


    console.log("Solicitando mensajes no leídos para idProfesional:", idProfesionalNum);

    axios
      .get(`http://localhost:4000/api/chat/no-leidos/${idProfesionalNum}`)
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
  }, [idProfesional]);


  // -------------------------------
  // 5️⃣ Cargar chat (marcar como leído)
  // -------------------------------
  // ... (Importaciones y Estados sin cambios) ...

// -------------------------------
// 5️⃣ Cargar chat (mostrar diálogo de confirmación)
// -------------------------------
const cargarChat = async (paciente) => {
    // 🛑 Anteriormente esto cargaba el chat directamente.
    // Ahora, solo establece el paciente seleccionado y abre el diálogo.
    setPacienteSeleccionado(paciente);
    setOpenDialog(true);
    // Nota: El 'marcar como leído' y la carga de mensajes se movieron a 'aceptarChat'.
};

// -------------------------------
// 6️⃣ Aceptar o rechazar chat (Lógica de carga movida aquí)
// -------------------------------
const aceptarChat = async () => {
    if (!pacienteSeleccionado) {
        setOpenDialog(false);
        return; // No hay paciente para cargar
    }

    const paciente = pacienteSeleccionado; // Usar la referencia del estado
    const pacienteId = String(paciente.idPaciente);
    setChatActual(paciente); // Establecer el chat actual inmediatamente

    // Asegúrate de usar idProfesional como String para la API
    const profIdNum = idProfesional;
    const body = { rolLector: 'profesional' };

    try {
        const data = await obtenerChat(pacienteId, profIdNum);
        setMensajes(data);

        // Marcar como leído en backend
        await axios.put(`http://localhost:4000/api/chat/leido/${pacienteId}/${profIdNum}`,
            body
        );

        // Limpiar contador (poner en 0)
        setMensajesNuevos((prev) => ({
            ...prev,
            [pacienteId]: 0,
        }));
    } catch (err) {
        console.error("Error al cargar chat:", err.response?.data || err.message);
        // Opcional: Mostrar un error al usuario
    } finally {
        // Cerrar el diálogo y limpiar la selección SÓLO después de la carga
        setOpenDialog(false);
        setPacienteSeleccionado(null);
    }
};

const rechazarChat = () => {
    // Simplemente cerrar el diálogo y limpiar la selección
    setOpenDialog(false);
    setPacienteSeleccionado(null);
};


  // -------------------------------
  // 7️⃣ Enviar mensaje
  // -------------------------------
  const handleSend = async (mensajeTexto) => {
    if (!chatActual || !mensajeTexto.trim()) return;

    const data = {
      idPaciente: String(chatActualRef.current.idPaciente),
      idProfesional: idProfesional,
      mensaje: mensajeTexto,
      enviado: "profesional",
      nombre: nombre
    };

    try {
      let msg = await enviarMensaje(data);
      // Si tu backend no lo añade, hazlo aquí (aunque DEBE añadirlo el backend):
      if (!msg.enviado) {
          msg = { ...msg, enviado: 'profesional' };
      }
      console.log("Objeto de mensaje devuelto por la API:", msg); 
      console.log("¿El texto del mensaje está aquí?", msg.mensaje);
      
      setMensajes((prev) => [...prev, msg]);
      if (socket) {
        // Usamos el objeto completo devuelto por la API (msg)
        socket.emit("enviar_mensaje", msg); 
      }
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 4,
          pb: 4,
          minHeight: "100vh",
        }}
      >
        <Box
          display="flex"
          height="100vh"
          sx={{
            bgcolor: "#f4f6f8",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          }}>
          {/* Sidebar */}
          <Box
            width={320}
            sx={{
              bgcolor: "#F4F6F8",
              color: "#fff",
              p: 2,
              overflowY: "auto",
            }}
          >
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
              <ChatListProfesional
                pacientes={pacientes}
                onSelect={cargarChat}
                mensajesNuevos={mensajesNuevos} // ✅ correcto
              />
            </Paper>
          </Box>

          {/* Chat */}
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
                      chatActual.nombrePaciente?.[0]?.toUpperCase()}
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
                    {chatActual.nombre || chatActual.nombrePaciente}
                  </Typography>
                  </Box>
                </Box>

                <ChatWindowProfesional mensajes={mensajes} usuarioActual={idProfesional} />
                <ChatInputProfesional onSend={handleSend} />
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
                Esperando mensaje de un paciente...
              </Box>
            )}
          </Box>

          {/* Diálogo */}
           <AnimatePresence>
        {openDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
          <Dialog open={openDialog} onClose={rechazarChat}
          PaperProps={{
                sx: {
                  borderRadius: "16px",
                  p: 1,
                  backgroundColor: "#fff",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
                },
              }}
              BackdropProps={{
                sx: {
                  backgroundColor: "rgba(9, 33, 129, 0.2)",
                  backdropFilter: "blur(3px)",
                },
              }}>
            <DialogTitle
            sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  pb: 0,
                }}
              >
                <WarningAmberIcon sx={{ color: "#C62828", fontSize: 32 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#092181" }}
                >
              
              Nuevo mensaje de paciente
              </Typography>
              </DialogTitle>
            <DialogContent>
             <DialogContentText sx={{ color: "#333", mt: 1 }}>
                El paciente <strong>{pacienteSeleccionado?.nombrePaciente}</strong> te ha enviado un
                mensaje. ¿Deseas abrir el chat?
              </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={rechazarChat} 
              variant="outlined" color="error" sx={{
                    borderRadius: 4,
                    px: 4,
                    textTransform: "capitalize",

                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
                    },
                    transition: "all 0.2s ease",
                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  }}>
                Cerrar
              </Button>
              <Button onClick={aceptarChat}  
              variant="contained"
              sx={{
                    borderRadius: 3,
                    px: 4,
                    backgroundColor: "#092181",
                    color: "white",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#1a3a9d",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(9, 33, 129, 0.3)",
                    },
                    transition: "all 0.2s ease",
                    flex: { xs: "1 1 100%", sm: "0 0 auto" }, // ocupa toda la fila en móviles
                  }}
                  >
                Abrir
              </Button>
            </DialogActions>
          </Dialog>
          </motion.div>
        )}
        </AnimatePresence>
        </Box>
      </Container>
    </Layout>
  );
};

export default ChatPageProfesional;
