// ChatWindowProfesional.jsx
import React, { useEffect, useRef } from "react";
import { Box, Typography, Avatar, Stack, Fade } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Person, MedicalServices } from "@mui/icons-material";

const ChatWindowProfesional = ({ mensajes, usuarioActual }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
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
      }}    >
      <AnimatePresence initial={false}>
        
 
        {mensajes.map((msg, index) => {
          const isMe = msg.enviado === "profesional";
          return (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 20,
              x: msg.enviado === "profesional" ? 50 : -50, 
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
            }}
            exit={{
              opacity: 0,
              y: 20,
              x: msg.enviado === "profesional" ? 50 : -50,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            style={{
              display: "flex",
              justifyContent:
                msg.enviado === "profesional" ? "flex-end" : "flex-start",
              marginBottom: "8px",
            }}
          >
              <Stack
                direction={isMe ? "row-reverse" : "row"}
                alignItems="flex-end"
                spacing={1}
                sx={{ mb: 2, px: 1 }}
              >
                {/* Avatar del emisor */}
                <Avatar
                  sx={{
                    bgcolor: isMe? "#67121A" : "#355C7D",
                    width: 36,
                    height: 36,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {isMe ? <MedicalServices /> : <Person />}
                </Avatar>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "18px",
                    maxWidth: "70%",
                    background: isMe ? "#F5E3E9 "
                      : " #e5eef7ff",
                    //bgcolor: msg.enviado === "profesional" ? "#4e8cff" : "#e5e5ea",
                    color: isMe ? "#090909ff" : "#000",
                    borderTopRightRadius: isMe ? "6px" : "18px",
                    borderTopLeftRadius: isMe ? "18px" : "6px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Nombre del emisor */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 0.3,
                      color: isMe ? "#67121A" : "#30485dff",
                    }}
                  >
                    {msg.nombre || (isMe ? "Profesional" : "Paciente")}
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

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth:
                          isMe
                            ? "10px 0 0 10px"
                            : "10px 10px 0 0",
                        borderColor:
                          isMe
                            ? "transparent transparent transparent #4e8cff"
                            : "transparent #e5e5ea transparent transparent",
                        right: isMe ? "-10px" : "auto",
                        left: isMe ? "auto" : "-10px",
                      }}
                    />
                </Box>
              </Stack>

          </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={scrollRef} />
    </Box>
  );
};

export default ChatWindowProfesional;
