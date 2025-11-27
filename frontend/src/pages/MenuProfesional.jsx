import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/LayoutProf";
import CalendarioProf from "../components/CalendarioProf";
import LineaTiempoProf from "../components/LineaTiempoProf";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import { useNavigate } from "react-router-dom";

export default function MenuProfesional() {
  const navigate = useNavigate();
  const [idUsuario, setIdUsuario] = useState(null);
  const [idProfesional, setIdProfesional] = useState(null);
  const [Nombre, setNombre] = useState("");

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/profesional/${storedIdUsuario}`)
        .then((res) => {
          const profesional = res.data;
          setNombre(profesional.nombre);
          setIdProfesional(profesional.idProfesional);
        })
        .catch((err) => {
          console.error("Error al obtener idProfesional:", err);
        });
    }
  }, []);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#F4F6F8",
          p: { xs: 2, sm: 3, md: 4 },
          gap: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#092181",
            textAlign: "center",
            width: "100%",
          }}
        >
          Bienvenido usuario profesional {Nombre && `- ${Nombre}`}
        </Typography>

        <Container
          maxWidth="md"
          disableGutters
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 9,
            width: "100%",
          }}
        >
          {/* Seguimiento emocional */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 65%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              minWidth: { xs: "100%", md: 400 },
              mb: { xs: 2, md: 0 },
            }}
          >
            <LineaTiempoProf />
          </Box>
          {/*  Tarjeta del calendario */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 35%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              width: "100%",
              minWidth: { xs: "100%", md: 400 },
              gap: 3,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <CalendarioProf mini />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                startIcon={<MarkUnreadChatAltIcon />}
                onClick={() => navigate("/chat-prof")}
                sx={{
                  minHeight: 48,
                  fontWeight: 600,
                  minWidth: 400,
                  textTransform: "none",
                  background: "#092181",
                  "&:hover": { background: "#1c3cc9" },
                  borderRadius: 2,
                }}
              >
                Ir al Chat de Emergencia
              </Button>

              <Button
                variant="outlined"
                startIcon={<AssignmentIndIcon />}
                onClick={() => navigate("/actividad-personalizada")}
                sx={{
                  width: "100%",
                  minHeight: 48,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: "#092181",
                  color: "#092181",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#eef2ff",
                    borderColor: "#092181",
                  },
                }}
              >
                Ir a Actividades Personalizadas
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}
