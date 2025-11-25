import React, { useEffect, useRef } from "react";
import { Box, Typography, Avatar, Fade, Stack } from "@mui/material";
import { Person, MedicalServices } from "@mui/icons-material";

const ChatWindow = ({ mensajes, usuarioActual }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  return (
    <Box 
      sx={{
        flex: 1,
        p: 2,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        background: " #f1f3f5ff",
        borderRadius: "12px",
        boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c5d3e9ff",
          borderRadius: "10px",
        },
      }}
    >
      {mensajes.map((msg, idx) => {
        const esPaciente = msg.enviado === "paciente";
        const esActual = msg.idUsuario === usuarioActual?.idUsuario;

        return (
          <Fade in key={idx} timeout={400}>
            <Stack
              direction={esPaciente ? "row-reverse" : "row"}
              alignItems="flex-end"
              spacing={1}
              sx={{ mb: 2, px: 1 }}
            >
              {/* Avatar del emisor */}
              <Avatar
                sx={{
                  bgcolor: esPaciente ? "#67121A" : "#355C7D",
                  width: 36,
                  height: 36,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {esPaciente ? <Person /> : <MedicalServices />}
              </Avatar>

              {/* Burbuja del mensaje */}
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 1.5,
                  background: esPaciente
                    ? "#F5E3E9 "
                    : " #e5eef7ff",
                  color: esPaciente ? "#fff" : "#333",
                  borderRadius: "18px",
                  borderTopRightRadius: esPaciente ? "6px" : "18px",
                  borderTopLeftRadius: esPaciente ? "18px" : "6px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Nombre del emisor */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 0.3,
                    color: esPaciente ? "#67121A" : "#30485dff",
                  }}
                >
                  {msg.nombre || (esPaciente ? "Paciente" : "Profesional")}
                </Typography>

                {/* Texto del mensaje */}
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.95rem",
                    lineHeight: 1.4,
                    whiteSpace: "pre-wrap",
                    color: "#080808ff"
                  }}
                >
                  {msg.mensaje}
                </Typography>
              </Box>
            </Stack>
          </Fade>
        );
      })}
      <div ref={chatEndRef} />
    </Box>
  );
};

export default ChatWindow;
