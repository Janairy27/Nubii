import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import CalendarioPac from "../components/Calendario";
import LineaTiempo from "../components/LineaTiempo";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import { useNavigate } from "react-router-dom";

export default function MenuPaciente() {
  const navigate = useNavigate();

  const [idUsuario, setIdUsuario] = useState(null);
  const [idPaciente, setIdPaciente] = useState(null);
  const [Nombre, setNombre] = useState("");

  useEffect(() => {
    const storedIdUsuario = localStorage.getItem("idUsuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
      axios
        .get(`http://localhost:4000/api/auth/paciente/${storedIdUsuario}`)
        .then((res) => {
          const paciente = res.data;
          setNombre(paciente.nombre);
          setIdPaciente(paciente.idPaciente);
        })
        .catch((err) => {
          console.error("Error al obtener idPaciente:", err);
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
          Bienvenido usuario paciente {Nombre && `- ${Nombre}`}
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
            <LineaTiempo />
          </Box>

          {/* Columna derecha: Calendario  */}
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
            {/* Calendario */}
            <Box sx={{ width: "100%" }}>
              <CalendarioPac mini />
            </Box>

            {/* Botones debajo del calendario */}
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
                onClick={() => navigate("/chat")}
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
                onClick={() => navigate("/listado-recomendaciones")}
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
