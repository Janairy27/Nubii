import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { PlayCircleOutlined, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Entrada = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const handleComenzar = () => navigate("/login");

  return (
    <Box
      sx={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 0,
        },
        // animación de entrada general
        animation: "fadeInBg 2s ease forwards",
        "@keyframes fadeInBg": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 3, md: 6 },
            bgcolor: "#FDFDFD",
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            p: { xs: 3, md: 6 },
            width: "100%",
            maxWidth: "900px",
            opacity: 0,
            transform: "translateY(30px)",
            animation: "fadeInUp 1.4s ease forwards",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(40px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Sección de texto */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
              animation: "fadeIn 1.6s ease forwards",
              "@keyframes fadeIn": {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#092181",
                fontSize: { xs: "2rem", md: "2.6rem" },
              }}
            >
              ¡Bienvenid@ a Nubii!
            </Typography>

            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#2D5D7B",
                fontStyle: "italic",
                mb: 4,
              }}
            >
              Transforma tus pensamientos.
              <Box component="span" display="block">
                Transforma tu vida.
              </Box>
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleComenzar}
              startIcon={<PlayCircleOutlined />}
              sx={{
                backgroundColor: "#092181",
                color: "#fff",
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#2D5D7B",
                  transform: "scale(1.08)",
                },
              }}
            >
              Comenzar ahora
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 5, maxWidth: 400 }}
            >
              Descubre cómo nuestra plataforma puede ayudarte a organizar tus
              ideas y mejorar tu productividad.
            </Typography>
          </Box>

          {/* Logo */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              animation: "fadeInScale 1.8s ease forwards",
              "@keyframes fadeInScale": {
                from: { opacity: 0, transform: "scale(0.8)" },
                to: { opacity: 1, transform: "scale(1)" },
              },
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo de Nubii"
              sx={{
                width: { xs: 180, md: 220 },
                height: { xs: 180, md: 220 },
                borderRadius: "50%",
                border: "6px solid #F5E3E9",
                backgroundColor: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                objectFit: "contain",
                p: 2,
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent
          sx={{
            p: { xs: 3, md: 5 },
            textAlign: "center",
            bgcolor: "#F5E3E9",
            borderRadius: 3,
            color: "#092181",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInModal 0.6s ease forwards",
            "@keyframes fadeInModal": {
              from: { opacity: 0, transform: "scale(0.95)" },
              to: { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "#67121A",
            }}
          >
            <Close />
          </IconButton>

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#092181" }}
          >
            ¡Gracias por elegir Nubii!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              my: 3,
              px: { xs: 1, md: 4 },
              color: "#2D5D7B",
              fontWeight: 500,
            }}
          >
            Estamos encantados de tenerte con nosotros. Prepárate para una
            experiencia que transformará la forma en que organizas tus
            pensamientos y gestionas tu vida.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => {
              handleClose();
              handleComenzar();
            }}
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "#67121A",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#2D5D7B",
              },
            }}
          >
            Continuar al Login
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Entrada;
